# 東北大学基督教青年会・寮史編集会 掲示板

旧青年会・寮史編集会のお知らせと記録を掲載する静的サイトです。

## お知らせを編集する

1. `notices.json` を開き、項目を追加または編集します。
2. `status` は `open`（掲載中）か `closed`（終了・過去）を指定します。
3. `showOnHome` を `true` にするとトップページにも表示されます。終了したお知らせをトップから外す場合は `false` にします。終了した項目は「過去のお知らせ」に表示されます。
4. `main` ブランチに反映すると、GitHub Actions がサイトを生成して公開します。

各項目には `category`（分類）、`title`（見出し）、`date`（日付の表示名と内容）、`paragraphs`（本文）を設定できます。行事の詳細は `details`、連絡先は `contactText` と `email`、署名は `signature` に記入します。不要な項目は省略できます。

ローカルで生成内容を確認する場合は、Node.jsで `node build.mjs` を実行し、生成された `_site/index.html` と `_site/archive.html` を開きます。追加パッケージのインストールは不要です。

## GitHub Pages

`.github/workflows/pages.yml` が `main` への反映または手動実行を受けてビルドと公開を行います。公開対象は生成フォルダー `_site/` です。
