package main

import (
	"fmt"
	"log"

	"github.com/mendableai/firecrawl-go"
)

func main() {
	// ローカルのFirecrawlインスタンスに接続します。
	// docker-compose.ymlに基づき、デフォルトのポートは3002です。
	// APIキーはローカル環境のため空文字列としています。
	// 必要に応じて .env ファイル等で設定された TEST_API_KEY を使用してください。
	app, err := firecrawl.NewFirecrawlApp("", "http://localhost:3002")
	if err != nil {
		log.Fatalf("Failed to create FirecrawlApp: %v", err)
	}

	// 指定したURLのコンテンツをスクレイプします。
	// "example.com" をテストしたいURLに置き換えてください。
	targetURL := "https://news.yahoo.co.jp/"
	fmt.Printf("Scraping URL: %s\n", targetURL)

	scrapeResult, err := app.ScrapeURL(targetURL, nil)
	if err != nil {
		log.Fatalf("Failed to scrape URL %s: %v", targetURL, err)
	}

	fmt.Println("\n--- Scraped Content (Markdown) ---")
	if scrapeResult.Markdown != "" {
		fmt.Println(scrapeResult.Markdown)
	} else {
		fmt.Println("No markdown content returned.")
	}

	// scrapeResult.Data から他の情報も取得できます
	// fmt.Printf("\n--- Scraped Data Object ---\n")
	// dataBytes, _ := json.MarshalIndent(scrapeResult.Data, "", "  ")
	// fmt.Println(string(dataBytes))

	fmt.Println("\n--- Scrape successful! ---")
}
