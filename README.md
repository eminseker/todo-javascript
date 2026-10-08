# Todo (JavaScript / Node.js)

JSON dosyasına kalıcı yapan basit bir yapılacaklar listesi CLI uygulaması.

## Gereksinim

Node.js 18+

## Çalıştırma

```bash
node todo.js add "Kitap oku"
node todo.js list
node todo.js done 1
node todo.js remove 1
```

## Testler

```bash
npm test        # veya: node --test
```

## Kapsam

- `fs` ile dosya okuma/yazma (JSON kalıcılığı)
- Komut yönlendirme (`switch`)
- Hata yönetimi (`try/catch`)
- `node:test` ile birim testleri
