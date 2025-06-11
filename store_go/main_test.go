package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/mendableai/firecrawl-go"
)

// stringPtr は文字列へのポインタを返すヘルパー関数です。
func stringPtr(s string) *string {
	return &s
}

func TestScrapeURL(t *testing.T) {
	// モックのFirecrawlDocumentデータ
	mockFirecrawlDoc := &firecrawl.FirecrawlDocument{
		Markdown: "Mocked Markdown Content",
		HTML:     "<h1>Mocked HTML Content</h1>",
		Metadata: &firecrawl.FirecrawlDocumentMetadata{
			Title:     stringPtr("Mocked Title"),
			SourceURL: stringPtr("http://example.com/mock-page"),
			Keywords:  stringPtr("mock, test"),
		},
	}

	tests := []struct {
		name          string
		serverHandler func(w http.ResponseWriter, r *http.Request)
		targetURL     string
		expectError   bool
		expectedDoc   *firecrawl.FirecrawlDocument
		checkDoc      bool // Whether to check the content of the document
	}{
		{
			name: "Success case",
			serverHandler: func(w http.ResponseWriter, r *http.Request) {
				if r.Method != http.MethodPost {
					t.Errorf("Expected POST request, got %s", r.Method)
					w.WriteHeader(http.StatusMethodNotAllowed)
					return
				}
				if r.URL.Path != "/v1/scrape" {
					t.Errorf("Expected path /v1/scrape, got %s", r.URL.Path)
					w.WriteHeader(http.StatusNotFound)
					return
				}
				// Simulate successful Firecrawl API response
				resp := struct {
					Success bool                         `json:"success"`
					Data    *firecrawl.FirecrawlDocument `json:"data,omitempty"`
				}{
					Success: true,
					Data:    mockFirecrawlDoc,
				}
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(resp)
			},
			targetURL:   "http://example.com/success",
			expectError: false,
			expectedDoc: mockFirecrawlDoc,
			checkDoc:    true,
		},
		{
			name: "API error case",
			serverHandler: func(w http.ResponseWriter, r *http.Request) {
				// Simulate Firecrawl API error response
				resp := struct {
					Success bool   `json:"success"`
					Error   string `json:"error,omitempty"` // firecrawl-go SDK might look for this or a general error structure
				}{
					Success: false,
					Error:   "Simulated API error",
				}
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusOK) // API error is often a 200 OK with error in body
				json.NewEncoder(w).Encode(resp)
			},
			targetURL:   "http://example.com/api-error",
			expectError: true,
		},
		{
			name: "HTTP error case (500)",
			serverHandler: func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte("Internal Server Error"))
			},
			targetURL:   "http://example.com/http-error",
			expectError: true,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			server := httptest.NewServer(http.HandlerFunc(tc.serverHandler))
			defer server.Close()

			doc, err := scrapeURL(tc.targetURL, server.URL) // Pass mock server URL

			if tc.expectError {
				if err == nil {
					t.Errorf("Expected an error, but got nil")
				}
			} else {
				if err != nil {
					t.Errorf("Expected no error, but got: %v", err)
				}
				if tc.checkDoc {
					if doc == nil {
						t.Fatal("Expected document, but got nil")
					}
					// Simple check, can be made more comprehensive
					if doc.Markdown != tc.expectedDoc.Markdown {
						t.Errorf("Expected Markdown '%s', got '%s'", tc.expectedDoc.Markdown, doc.Markdown)
					}
					if doc.Metadata.Title == nil || tc.expectedDoc.Metadata.Title == nil || *doc.Metadata.Title != *tc.expectedDoc.Metadata.Title {
						expectedTitle := "<nil>"
						if tc.expectedDoc.Metadata.Title != nil {
							expectedTitle = *tc.expectedDoc.Metadata.Title
						}
						actualTitle := "<nil>"
						if doc.Metadata.Title != nil {
							actualTitle = *doc.Metadata.Title
						}
						t.Errorf("Expected Metadata.Title '%s', got '%s'", expectedTitle, actualTitle)
					}
				}
			}
		})
	}

	// Test case for invalid endpoint (non-HTTP server)
	t.Run("Invalid endpoint", func(t *testing.T) {
		_, err := scrapeURL("http://example.com/invalid", "this-is-not-a-valid-url")
		if err == nil {
			t.Errorf("Expected an error for invalid endpoint, but got nil")
		}
	})
}

func TestSaveScrapeResultToFile(t *testing.T) {
	// テスト用のモックデータを作成
	mockDoc := &firecrawl.FirecrawlDocument{
		Markdown: "Test Markdown Content",
		HTML:     "<h1>Test HTML Content</h1>",
		Metadata: &firecrawl.FirecrawlDocumentMetadata{
			Title:     stringPtr("Test Title"),
			SourceURL: stringPtr("http://example.com/test-page"),
			Keywords:  stringPtr("test, mock"), // Changed to *string
		},
	}

	prefix := "test_save_output"

	// 一時ディレクトリを作成し、テスト終了時に自動的にクリーンアップされるようにする
	tempDir := t.TempDir()

	// 現在の作業ディレクトリを保存し、テスト終了時に元に戻す
	originalWD, err := os.Getwd()
	if err != nil {
		t.Fatalf("Failed to get current working directory: %v", err)
	}
	// テスト中は一時ディレクトリを作業ディレクトリとする
	if err := os.Chdir(tempDir); err != nil {
		t.Fatalf("Failed to change working directory to tempDir: %v", err)
	}
	defer os.Chdir(originalWD) // 必ず元のディレクトリに戻す

	// テスト対象の関数を呼び出す
	savedFilename, err := saveScrapeResultToFile(mockDoc, prefix)

	// エラーが発生しないことを確認
	if err != nil {
		t.Fatalf("saveScrapeResultToFile returned an error: %v", err)
	}

	// 返されたファイル名が期待通りか確認 (プレフィックスと拡張子)
	if !strings.HasPrefix(savedFilename, prefix+"_") {
		t.Errorf("Expected filename to start with '%s_', got '%s'", prefix, savedFilename)
	}
	if !strings.HasSuffix(savedFilename, ".json") {
		t.Errorf("Expected filename to end with '.json', got '%s'", savedFilename)
	}

	// ファイルが実際に作成されたか確認 (フルパスで)
	filePath := filepath.Join(tempDir, savedFilename) // ChdirしているのでsavedFilenameだけで良いが念のため
	fileInfo, err := os.Stat(filePath)
	if os.IsNotExist(err) {
		t.Fatalf("Expected file '%s' to be created, but it does not exist", savedFilename)
	}
	if err != nil {
		t.Fatalf("Error stating file '%s': %v", savedFilename, err)
	}
	if fileInfo.IsDir() {
		t.Fatalf("Expected '%s' to be a file, but it's a directory", savedFilename)
	}

	// ファイルの内容を読み込む
	fileData, err := os.ReadFile(filePath)
	if err != nil {
		t.Fatalf("Failed to read saved file '%s': %v", savedFilename, err)
	}

	// 期待されるJSONデータを生成 (元の関数と同じインデントで)
	expectedJSON, err := json.MarshalIndent(mockDoc, "", "  ")
	if err != nil {
		t.Fatalf("Failed to marshal mockDoc to JSON: %v", err)
	}

	// ファイルの内容が期待されるJSONと一致するか確認
	if string(fileData) != string(expectedJSON) {
		t.Errorf("File content mismatch.\nExpected:\n%s\nGot:\n%s", string(expectedJSON), string(fileData))
	}

	// t.TempDir() を使っているので、ファイルの明示的な削除は不要
	// os.Remove(filePath) // 不要
}
