fn main() {
    // For manual run: scrape and map Yahoo! News homepage and save results.
    let runtime = tokio::runtime::Runtime::new().expect("Failed to create Tokio runtime");
    runtime.block_on(async {
        let url = "https://news.yahoo.co.jp/";

        // Scrape the URL
        println!("\n=== Scraping URL ===");
        match store::scrape_url(url, store::FIRECRAWL_ENDPOINT).await {
            Ok(doc) => match store::save_scrape_result_to_file(&doc, "scraped_content") {
                Ok(file) => println!("Scraped data saved to {}", file),
                Err(e) => eprintln!("Failed to save file: {}", e),
            },
            Err(e) => eprintln!("Error during scraping: {}", e),
        }

        // Map the URL
        println!("\n=== Mapping URL ===");
        match store::map_url(url, store::FIRECRAWL_ENDPOINT).await {
            Ok(urls) => {
                println!("Found {} URLs:", urls.len());
                for (i, url) in urls.iter().enumerate().take(5) {
                    println!("  {}. {}", i + 1, url);
                }
                if urls.len() > 5 {
                    println!("  ... and {} more", urls.len() - 5);
                }

                match store::save_map_result_to_file(&urls, "mapped_content") {
                    Ok(file) => println!("Mapped URLs saved to {}", file),
                    Err(e) => eprintln!("Failed to save file: {}", e),
                }
            },
            Err(e) => eprintln!("Error during mapping: {}", e),
        }
    });
}
