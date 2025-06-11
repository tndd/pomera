fn main() {
    // For manual run: scrape Yahoo! News homepage and save result.
    let runtime = tokio::runtime::Runtime::new().expect("Failed to create Tokio runtime");
    runtime.block_on(async {
        let url = "https://news.yahoo.co.jp/";
        match store::scrape_url(url, store::FIRECRAWL_ENDPOINT).await {
            Ok(doc) => match store::save_scrape_result_to_file(&doc, "scraped_content") {
                Ok(file) => println!("Scraped data saved to {}", file),
                Err(e) => eprintln!("Failed to save file: {}", e),
            },
            Err(e) => eprintln!("Error during scraping: {}", e),
        }
    });
}
