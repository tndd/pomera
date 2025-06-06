use chrono::Local;
use firecrawl_sdk::{FirecrawlApp, ScrapeOptions, error::FirecrawlError};
use serde_json;
use std::fs::File;
use std::io::Write;
use std::path::Path;

const FIRECRAWL_ENDPOINT: &str = "http://localhost:3002";

async fn scrape_url(target_url: &str) -> Result<firecrawl_sdk::scrape::ScrapeResult, FirecrawlError> {
    println!("Scraping URL: {}", target_url);
    // APIキーはローカルホストの場合Noneで良いが、SDKのnew_selfhostedはOption<String>を期待するためSome(String::new())とする
    // もしくはSDKのnew_selfhostedがNoneを許容するように修正が必要かもしれない
    let app = FirecrawlApp::new_selfhosted(FIRECRAWL_ENDPOINT.to_string(), Some(String::new()))
        .expect("Failed to initialize FirecrawlApp for self-hosted instance");

    // ScrapeOptionsはNoneでも良いが、Go版に合わせて明示的にデフォルトを使用
    let options: Option<ScrapeOptions> = None; 
    app.scrape_url(target_url, options).await
}

fn save_scrape_result_to_file(
    scrape_result: &firecrawl_sdk::scrape::ScrapeResult,
    prefix: &str,
) -> Result<String, Box<dyn std::error::Error>> {
    println!("\n--- Saving Scraped Content (JSON) ---");
    let json_data = serde_json::to_string_pretty(scrape_result)?;

    let timestamp = Local::now().format("%Y%m%d_%H%M%S").to_string();
    let filename = format!("{}_{}.json", prefix, timestamp);

    let path = Path::new(&filename);
    let mut file = File::create(&path)?;
    file.write_all(json_data.as_bytes())?;

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
