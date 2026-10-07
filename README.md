# 東北大学基督教青年会・寮史編集会 掲示板

旧青年会・寮史編集会のお知らせと記録を掲載する静的サイトです。

## GitHub Pages

このリポジトリは GitHub Actions から GitHub Pages に公開する構成です。

1. GitHub のリポジトリで **Settings → Pages** を開きます。
2. **Build and deployment** の **Source** を **GitHub Actions** にします。
3. `main` ブランチへ push すると、`.github/workflows/pages.yml` がサイトをデプロイします。
4. Pages の設定画面または Actions の実行結果に表示される URL を開きます。

HTML、CSS、JavaScriptだけで構成しているため、サイトのビルド手順や依存パッケージはありません。

## お知らせの更新

お知らせ欄は `index.html` の `<section id="news">` にあります。各項目の日付や内容は、元のお知らせで確認できる情報に沿って更新してください。終了した行事の報告や、未定の期限など、読者の行動につながらない項目は掲載しません。
