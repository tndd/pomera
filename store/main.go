package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/mendableai/firecrawl-go"
)

func main() {
	apiKey := "FC_DUMMY_API_KEY" // 空ではエラーになるため必要
	app, err := firecrawl.NewFirecrawlApp(apiKey, "http://localhost:3002")
	if err != nil {
		log.Fatalf("Failed to create FirecrawlApp: %v", err)
	}

	targetURL := "https://news.yahoo.co.jp/"
	fmt.Printf("Scraping URL: %s\n", targetURL)

	scrapeResult, err := app.ScrapeURL(targetURL, nil)
	if err != nil {
		log.Fatalf("Failed to scrape URL %s: %v", targetURL, err)
	}

	fmt.Println("\n--- Saving Scraped Content (JSON) ---")
	// scrapeResult をJSON形式でシリアライズ
	jsonData, err := json.MarshalIndent(scrapeResult, "", "  ")
	if err != nil {
		log.Fatalf("Failed to marshal scrapeResult to JSON: %v", err)
	}

	// 現在時刻からファイル名を生成 (例: scraped_20250606_020639.json)
	timestamp := time.Now().Format("20060102_150405")
	filename := fmt.Sprintf("scraped_%s.json", timestamp)

	// ファイルにJSONデータを書き込み
	err = os.WriteFile(filename, jsonData, 0644)
	if err != nil {
		log.Fatalf("Failed to save JSON to file: %v", err)
	}

	fmt.Printf("Scraped data has been saved to: %s\n", filename)

	fmt.Println("\n--- Scrape successful! ---")
}
