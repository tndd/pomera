use rand::Rng;
use std::io;
use std::cmp::Ordering;

fn main() {
    println!("数当てゲームへようこそ！");
    println!("1から100までの数字を当ててください。");

    let secret_number = rand::thread_rng().gen_range(1..=100);
    let mut guess_count = 0;

    loop {
        println!("\n予想を入力してください:");

        let mut guess = String::new();

        io::stdin()
            .read_line(&mut guess)
            .expect("入力を読み込めませんでした");

        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("1から100までの数字を入力してください。");
                continue;
            }
        };

        guess_count += 1;

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("小さすぎます！"),
            Ordering::Greater => println!("大きすぎます！"),
            Ordering::Equal => {
                println!("おめでとうございます！正解です！");
                println!("{}回で正解しました！", guess_count);
                break;
            }
        }
    }
}
