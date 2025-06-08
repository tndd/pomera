use chrono::Local;
use firecrawl_sdk::{FirecrawlApp, ScrapeOptions, error::FirecrawlError};
use serde_json;
use std::fs::File;
use std::io::Write;
use std::path::Path;

const FIRECRAWL_ENDPOINT: &str = "http://localhost:3002";

async fn scrape_url(target_url: &str) -> Result<String, Box<dyn std::error::Error>> {
    println!("Scraping URL: {}", target_url);
    // APIキーはローカルホストの場合Noneで良いが、SDKのnew_selfhostedはOption<String>を期待するためSome(String::new())とする
    let app = FirecrawlApp::new_selfhosted(FIRECRAWL_ENDPOINT.to_string(), Some(String::new()))
        .expect("Failed to initialize FirecrawlApp for self-hosted instance");

    // ScrapeOptionsはNoneでも良いが、Go版に合わせて明示的にデフォルトを使用
    let options: Option<ScrapeOptions> = None;
    let result = app.scrape_url(target_url, options).await?;

    // ScrapeResultをJSON文字列に変換
    let json_string = serde_json::to_string_pretty(&result)?;
    Ok(json_string)
}

fn save_scrape_result_to_file(
    json_string: &str,
    prefix: &str,
) -> Result<String, Box<dyn std::error::Error>> {
    println!("\n--- Saving Scraped Content (JSON) ---");

    let timestamp = Local::now().format("%Y%m%d_%H%M%S").to_string();
    let filename = format!("{}_{}.json", prefix, timestamp);

    let mut file = File::create(&filename)?;
    file.write_all(json_string.as_bytes())?;

    println!("Saved scraped content to: {}", filename);
    Ok(filename)
}

#[tokio::main]
async fn main() {
    let target_url = "https://news.yahoo.co.jp/"; // Example URL

    match scrape_url(target_url).await {
        Ok(scrape_result) => {
            match save_scrape_result_to_file(&scrape_result, "scraped_content_rust") {
                Ok(saved_filename) => {
                    println!("Scraped data has been saved to: {}", saved_filename);
                    println!("\n--- Process successful! ---");
                }
                Err(e) => {
                    eprintln!("Error saving file: {}", e);
                }
            }
        }
        Err(e) => {
            eprintln!("Error during scraping: {}", e);
        }
    }
}
