package main

import (
	"bufio"
	"fmt"
	"math/rand"
	"os"
	"strconv"
	"strings"
	"time"
)

func main() {
	// 乱数のシードを設定
	rand.Seed(time.Now().UnixNano())

	// 1から100までのランダムな数を生成
	target := rand.Intn(100) + 1
	attempts := 0

	fmt.Println("数当てゲームへようこそ！")
	fmt.Println("1から100までの数字を当ててください。")

	// 標準入力から読み込むためのScannerを作成
	reader := bufio.NewReader(os.Stdin)


	for {
		fmt.Print("\n予想を入力してください: ")

		// ユーザーからの入力を読み取る
		input, err := reader.ReadString('\n')
		if err != nil {
			fmt.Println("エラーが発生しました:", err)
			continue
		}

		// 入力の前後の空白を削除
		input = strings.TrimSpace(input)


		// 入力を数値に変換
		guess, err := strconv.Atoi(input)
		if err != nil {
			fmt.Println("1から100までの数字を入力してください。")
			continue
		}

		attempts++


		// 予想が正解かどうかをチェック
		switch {
		case guess < 1 || guess > 100:
			fmt.Println("1から100の間の数字を入力してください。")
		case guess < target:
			fmt.Println("小さすぎます！")
		case guess > target:
			fmt.Println("大きすぎます！")
		default:
			fmt.Printf("おめでとうございます！正解です！\n%d回で正解しました！\n", attempts)
			return
		}
	}
}
