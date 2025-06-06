package main

import (
	"encoding/json"
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
