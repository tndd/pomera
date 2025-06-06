package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/mendableai/firecrawl-go"
)

const (
	firecrawlAPIKey   = "FC_DUMMY_API_KEY" // 空ではエラーになるため必要
	firecrawlEndpoint = "http://localhost:3002"
)

// scrapeURL fetches content from the given URL using Firecrawl and returns the scrape result.
func scrapeURL(targetURL string, apiEndpoint string) (*firecrawl.FirecrawlDocument, error) {
	fmt.Printf("Scraping URL: %s\n", targetURL)
	app, err := firecrawl.NewFirecrawlApp(firecrawlAPIKey, apiEndpoint)
	if err != nil {
		return nil, fmt.Errorf("failed to create FirecrawlApp: %w", err)
	}

	scrapeResult, err := app.ScrapeURL(targetURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to scrape URL %s: %w", targetURL, err)
	}
	return scrapeResult, nil
}

// saveScrapeResultToFile saves the Firecrawl scrape result as a JSON file.
// It returns the name of the saved file or an error.
func saveScrapeResultToFile(scrapeResult *firecrawl.FirecrawlDocument, prefix string) (string, error) {
	fmt.Println("\n--- Saving Scraped Content (JSON) ---")
	jsonData, err := json.MarshalIndent(scrapeResult, "", "  ")
	if err != nil {
		return "", fmt.Errorf("failed to marshal scrapeResult to JSON: %w", err)
	}

	timestamp := time.Now().Format("20060102_150405")
	filename := fmt.Sprintf("%s_%s.json", prefix, timestamp)

	err = os.WriteFile(filename, jsonData, 0644)
	if err != nil {
		return "", fmt.Errorf("failed to save JSON to file %s: %w", filename, err)
	}

	return filename, nil
}

func main() {
	targetURL := "https://news.yahoo.co.jp/" // Example URL

	scrapeResult, err := scrapeURL(targetURL, firecrawlEndpoint)
	if err != nil {
		log.Fatalf("Error during scraping: %v", err)
	}

	savedFilename, err := saveScrapeResultToFile(scrapeResult, "scraped_content")
	if err != nil {
		log.Fatalf("Error saving file: %v", err)
	}

	fmt.Printf("Scraped data has been saved to: %s\n", savedFilename)
	fmt.Println("\n--- Process successful! ---")
}
