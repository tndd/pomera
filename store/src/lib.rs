use chrono::Local;
use firecrawl::{FirecrawlApp, FirecrawlError, document::Document};
use serde_json::to_vec_pretty;
use std::fs::File;
use std::io::Write;

/// Default local Firecrawl endpoint.
pub const FIRECRAWL_ENDPOINT: &str = "http://localhost:3002";

/// Scrapes the given URL using Firecrawl and returns the resulting `Document`.
pub async fn scrape_url(
    target_url: &str,
    api_endpoint: &str,
) -> Result<Document, FirecrawlError> {
    println!("Scraping URL: {}", target_url);
    let app = FirecrawlApp::new_selfhosted(api_endpoint, None::<&str>)?;
    app.scrape_url(target_url, None).await
}

/// Maps the given URL using Firecrawl and returns a vector of URLs.
pub async fn map_url(
    target_url: &str,
    api_endpoint: &str,
) -> Result<Vec<String>, FirecrawlError> {
    println!("Mapping URL: {}", target_url);
    let app = FirecrawlApp::new_selfhosted(api_endpoint, None::<&str>)?;
    app.map_url(target_url, None).await
}

/// Saves a `Document` as pretty-printed JSON. Returns the generated filename on success.
pub fn save_scrape_result_to_file(
    doc: &Document,
    prefix: &str,
) -> std::io::Result<String> {
    println!("\n--- Saving Scraped Content (JSON) ---");
    let json_bytes = to_vec_pretty(doc).expect("failed to serialise document");
    let timestamp = Local::now().format("%Y%m%d_%H%M%S");
    let filename = format!("{}_{}.json", prefix, timestamp);

    let mut file = File::create(&filename)?;
    file.write_all(&json_bytes)?;
    Ok(filename)
}

/// Saves map results (a vector of URLs) as pretty-printed JSON. Returns the generated filename on success.
pub fn save_map_result_to_file(
    urls: &[String],
    prefix: &str,
) -> std::io::Result<String> {
    println!("\n--- Saving Map Results (JSON) ---");
    let json_bytes = to_vec_pretty(urls).expect("failed to serialise URLs");
    let timestamp = Local::now().format("%Y%m%d_%H%M%S");
    let filename = format!("{}_{}.json", prefix, timestamp);

    let mut file = File::create(&filename)?;
    file.write_all(&json_bytes)?;
    Ok(filename)
}

#[cfg(test)]
mod tests {
    use std::path::Path;

    use super::*;
    use httpmock::Method::POST;
    use httpmock::{Mock, MockServer};
    use serde_json::{Value, json};
    use tempfile::tempdir;

    // Helper to build a minimal mock `Document`.
    fn build_mock_document() -> Document {
        use firecrawl::document::DocumentMetadata;
        Document {
            markdown: Some("Mocked Markdown Content".to_string()),
            html: Some("<h1>Mocked HTML Content</h1>".to_string()),
            metadata: DocumentMetadata {
                source_url: "http://example.com/mock-page".to_string(),
                status_code: 200,
                title: Some("Mocked Title".to_string()),
                keywords: Some("mock, test".to_string()),
                ..Default::default()
            },
            ..Default::default()
        }
    }

    #[tokio::test]
    async fn test_scrape_url_variants() {
        let mock_doc = build_mock_document();

        struct Case {
            name: &'static str,
            setup: Box<dyn Fn(&MockServer) -> Mock + Send + Sync>,
            expect_ok: bool,
        }

        let cases = vec![
            Case {
                name: "success",
                setup: Box::new(|server| {
                    let body: Value = json!({
                        "success": true,
                        "data": serde_json::to_value(&build_mock_document()).unwrap()
                    });
                    server.mock(|when, then| {
                        when.method(POST).path("/v1/scrape");
                        then.status(200).json_body(body);
                    })
                }),
                expect_ok: true,
            },
            Case {
                name: "api_error",
                setup: Box::new(|server| {
                    let body = json!({
                        "success": false,
                        "error": "Simulated API error"
                    });
                    server.mock(|when, then| {
                        when.method(POST).path("/v1/scrape");
                        then.status(200).json_body(body);
                    })
                }),
                expect_ok: false,
            },
            Case {
                name: "http_error",
                setup: Box::new(|server| {
                    server.mock(|when, then| {
                        when.method(POST).path("/v1/scrape");
                        then.status(500).body("Internal Server Error");
                    })
                }),
                expect_ok: false,
            },
        ];

        for case in cases {
            let server = MockServer::start_async().await;
            (case.setup)(&server);

            let result =
                scrape_url("http://example.com", &server.base_url()).await;

            if case.expect_ok {
                assert!(result.is_ok(), "{} should succeed", case.name);
                let doc = result.unwrap();
                assert_eq!(doc.markdown, mock_doc.markdown);
                assert_eq!(doc.metadata.title, mock_doc.metadata.title);
            } else {
                assert!(result.is_err(), "{} should fail", case.name);
            }
        }

        // Invalid endpoint test
        let invalid = scrape_url("http://example.com", "not-a-valid-url").await;
        assert!(invalid.is_err());
    }

    #[test]
    fn test_save_scrape_result_to_file() {
        let doc = build_mock_document();
        let temp = tempdir().unwrap();
        let old_dir = std::env::current_dir().unwrap();
        std::env::set_current_dir(temp.path()).unwrap();

        let filename = save_scrape_result_to_file(&doc, "test_output").unwrap();
        assert!(filename.starts_with("test_output_"));
        assert!(filename.ends_with(".json"));
        assert!(Path::new(&filename).exists());

        let saved = std::fs::read_to_string(&filename).unwrap();
        let expected = serde_json::to_string_pretty(&doc).unwrap();
        assert_eq!(saved, expected);

        // Directory cleanup handled by temp file
        std::env::set_current_dir(old_dir).unwrap();
    }

    #[tokio::test]
    async fn test_map_url_variants() {
        struct Case {
            name: &'static str,
            setup: Box<dyn Fn(&MockServer) -> Mock + Send + Sync>,
            expect_ok: bool,
            expected_urls: Option<Vec<String>>,
        }

        let cases = vec![
            Case {
                name: "success",
                setup: Box::new(|server| {
                    let mock_urls = vec![
                        "http://example.com/page1".to_string(),
                        "http://example.com/page2".to_string(),
                        "http://example.com/page3".to_string(),
                    ];
                    let body: Value = json!({
                        "success": true,
                        "links": mock_urls
                    });
                    server.mock(|when, then| {
                        when.method(POST).path("/v1/map");
                        then.status(200).json_body(body);
                    })
                }),
                expect_ok: true,
                expected_urls: Some(vec![
                    "http://example.com/page1".to_string(),
                    "http://example.com/page2".to_string(),
                    "http://example.com/page3".to_string(),
                ]),
            },
            Case {
                name: "api_error",
                setup: Box::new(|server| {
                    let body = json!({
                        "success": false,
                        "error": "Simulated API error"
                    });
                    server.mock(|when, then| {
                        when.method(POST).path("/v1/map");
                        then.status(200).json_body(body);
                    })
                }),
                expect_ok: false,
                expected_urls: None,
            },
            Case {
                name: "http_error",
                setup: Box::new(|server| {
                    server.mock(|when, then| {
                        when.method(POST).path("/v1/map");
                        then.status(500).body("Internal Server Error");
                    })
                }),
                expect_ok: false,
                expected_urls: None,
            },
        ];

        for case in cases {
            let server = MockServer::start_async().await;
            (case.setup)(&server);

            let result =
                map_url("http://example.com", &server.base_url()).await;

            println!("Test case: {}", case.name);
            println!("Result: {:?}", result);

            if case.expect_ok {
                assert!(result.is_ok(), "{} should succeed", case.name);
                let urls = result.unwrap();
                assert_eq!(urls, case.expected_urls.unwrap());
            } else {
                assert!(result.is_err(), "{} should fail", case.name);
            }
        }

        // Invalid endpoint test
        let invalid = map_url("http://example.com", "not-a-valid-url").await;
        assert!(invalid.is_err());
    }

    #[test]
    fn test_save_map_result_to_file() {
        let urls = vec![
            "http://example.com/page1".to_string(),
            "http://example.com/page2".to_string(),
            "http://example.com/page3".to_string(),
        ];
        let temp = tempdir().unwrap();
        let old_dir = std::env::current_dir().unwrap();
        std::env::set_current_dir(temp.path()).unwrap();

        let filename = save_map_result_to_file(&urls, "test_map_output").unwrap();
        assert!(filename.starts_with("test_map_output_"));
        assert!(filename.ends_with(".json"));
        assert!(Path::new(&filename).exists());

        let saved = std::fs::read_to_string(&filename).unwrap();
        let expected = serde_json::to_string_pretty(&urls).unwrap();
        assert_eq!(saved, expected);

        // Directory cleanup handled by temp file
        std::env::set_current_dir(old_dir).unwrap();
    }
}
