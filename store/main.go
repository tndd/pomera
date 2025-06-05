package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/mendableai/firecrawl-go"
)

func main() {
	// ローカルのFirecrawlインスタンスに接続します。
	// docker-compose.ymlに基づき、デフォルトのポートは3002です。
	// APIキーはローカル環境のため空文字列としています。
	// 必要に応じて .env ファイル等で設定された TEST_API_KEY を使用してください。
	// TEST_API_KEYが空文字の場合でも、SDKが空でないキーを要求するため、
	// ダミーのキーを設定します。
	apiKey := "FC_DUMMY_API_KEY" // ダミーAPIキー
	app, err := firecrawl.NewFirecrawlApp(apiKey, "http://localhost:3002")
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
		// 現在時刻からファイル名を生成 (例: scraped_20250606_020639.md)
		timestamp := time.Now().Format("20060102_150405")
		filename := fmt.Sprintf("scraped_%s.md", timestamp)

		// ファイルにMarkdownを書き込み
		err = os.WriteFile(filename, []byte(scrapeResult.Markdown), 0644)
		if err != nil {
			log.Fatalf("Failed to save markdown to file: %v", err)
		}

		fmt.Printf("Markdown content has been saved to: %s\n", filename)
	} else {
		fmt.Println("No markdown content returned.")
	}

	// scrapeResult.Data から他の情報も取得できます
	// fmt.Printf("\n--- Scraped Data Object ---\n")
	// dataBytes, _ := json.MarshalIndent(scrapeResult.Data, "", "  ")
	// fmt.Println(string(dataBytes))

	fmt.Println("\n--- Scrape successful! ---")
}
