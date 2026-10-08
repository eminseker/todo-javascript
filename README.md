# Todo (JavaScript / Node.js)

JSON dosyasına kalıcı yapan basit bir yapılacaklar listesi CLI uygulaması.

## Gereksinim

Node.js 18+ (Node 24 ile doğrulanmıştır)

## Dosya yapısı

```
todo-javascript/
├── index.js                  # package.json "main" — kamu API girişi
├── todo.js                   # CLI girişi (geriye dönük uyumlu komut satırı)
├── package.json
├── README.md
├── .gitignore                # node_modules/ ve todo.json
├── todo.json                 # veri dosyası (git ignore içinde, çalışma anında oluşur)
├── src/
│   ├── cli.js                # argv ayrıştırma, komut kaydı ve yönlendirme
│   ├── task.js               # Task modeli/fabrikası ve doğrulama
│   ├── store.js              # todo.json okuma/yazma (atomik yazma)
│   ├── taskService.js        # iş kuralları: ekle/tamamla/sil/listele
│   ├── commands/
│   │   ├── add.js            # add komutu
│   │   ├── list.js           # list komutu
│   │   ├── done.js           # done komutu
│   │   └── remove.js         # remove komutu
│   └── utils/
│       ├── id.js             # id üretimi ve ayrıştırma
│       ├── date.js           # tarih üretimi ve biçimlendirme
│       └── format.js         # konsol çıktısı biçimlendirme
└── test/
    ├── task.test.js          # model + yardımcılar
    ├── taskService.test.js   # iş kuralları + CLI yönlendirme
    └── store.test.js         # kalıcılık ve atomik yazma
```

13 kendi kaynak dosyası (testler hariç), 3 test dosyası.

## Katmanlar

| Katman | Dosyalar | Sorumluluk |
| --- | --- | --- |
| Giriş | `index.js`, `todo.js` | Paket API'si ve komut satırı girişi |
| CLI | `src/cli.js`, `src/commands/*` | Argüman ayrıştırma, komut kaydı, çıktı |
| İş kuralları | `src/taskService.js`, `src/task.js` | Ekleme, tamamlama, silme, listeleme |
| Veri | `src/store.js` | JSON kalıcılığı, atomik yazma (tmp + rename) |
| Yardımcılar | `src/utils/*` | id, tarih, biçimlendirme |

## Çalıştırma

```bash
node todo.js add "Kitap oku"
node todo.js list
node todo.js done 1
node todo.js remove 1
```

`node index.js ...` da aynı komutları çalıştırır.

Örnek çıktı:

```
$ node todo.js add "Kitap oku"
#1 eklendi.

$ node todo.js list
[ ] 1. Kitap oku (2026-10-08)

$ node todo.js done 1
#1 tamamlandı.
```

## Programatik kullanım

```js
const { createService } = require("./index");

const service = createService();
service.add("Kitap oku");
console.log(service.list());
```

## Testler

```bash
npm test        # veya: node --test
```

## Kapsam

- `fs` ile dosya okuma/yazma (JSON kalıcılığı) ve atomik yazma
- Modüler komut kaydı ve yönlendirme (`src/cli.js`)
- Model / servis / veri erişim katmanlarının ayrıştırılması
- Hata yönetimi (`try/catch`) ve çıkış kodları
- `node:test` ile birim testleri
