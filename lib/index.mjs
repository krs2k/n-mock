import express from "express";
import * as crypto from "crypto";

const app = express();
app.use(express.json());

app.post("/SDF3RestApi/api/GetDevId", (req, res) => {
  const shortDeviceId = req.body.ShortDeviceID;

  if (!shortDeviceId) {
    throw new Error("missing short device id");
  }

  if (!shortDeviceId.includes("A")) {
    res.json({});
  }
  res.json({
    DeviceId: crypto
      .createHash("md5")
      .update(req.body.ShortDeviceID)
      .digest("hex"),
    Result: 0,
  });
});

app.post("/SDF3RestApi/api/GetReceipt", (req, res) => {
  const { Limit, LastJPKID, UID } = req.body;
  const data = [];

  for (let i = 0; i < Limit; i++) {
    data.push({
      dokument: {
        naglowek: {
          wersja: "JPK_KASA_PARAGON_v1-0",
          dataJPK: "2021-06-01T09:45:09.838Z",
        },
        podmiot1: {
          NIP: "5220001694",
          nazwaPod:
            "COMP S.A. Jutrzenki 116, 02-230 Warszawa Oddział Nowy Sącz NOVITUS - Centrum Technologii Sprzedaży ",
          adresPod: {
            kodPoczt: "33-300",
            miejsc: "Nowy Sącz",
            nrDomu: "118",
            ulica: "Nawojowska",
          },
          nrUnik: "WAH2001009137",
          nrFabr: "WAH2001009137",
          nrEwid: "2021/000005699",
        },
        paragon: {
          JPKID: 6,
          pamiecChr: 1,
          nrDok: 4,
          pozycja: [
            {
              towar: {
                brutto: 500,
                cena: 500,
                idStPTU: "A",
                ilosc: "1",
                nazwa: "mycie",
                oper: false,
              },
            },
            {
              towar: {
                brutto: 400,
                cena: 400,
                idStPTU: "A",
                ilosc: "1",
                nazwa: "woskowanie",
                oper: false,
              },
            },
            {
              towar: {
                brutto: 1100,
                cena: 1100,
                idStPTU: "A",
                ilosc: "1",
                nazwa: "nabłyszczanie opon",
                oper: false,
              },
            },
          ],
          stPTU: [
            { id: "A", wart: 2300 },
            { id: "B", wart: 800 },
            { id: "C", wart: 500 },
            { id: "D", wart: 0 },
            { id: "E", wart: "ZW" },
          ],
          podsum: {
            sumaNetto: [
              { idStPTU: "A", brutto: 2000, vat: 374 },
              { idStPTU: "B", brutto: 0, vat: 0 },
              { idStPTU: "C", brutto: 0, vat: 0 },
              { idStPTU: "D", brutto: 0, vat: 0 },
              { idStPTU: "E", brutto: 0, vat: 0 },
            ],
            sumaPod: 374,
            sumaBrutto: 2000,
            waluta: "PLN",
          },
          total: { zaplZwrot: 2000 },
          platnosc: [{ reszta: false, forma: "1", wart: 2000 }],
          nrParag: 1,
          nrKasy: "0",
          zakSprzed: "2021-06-01T09:45:09.827Z",
          kasjer: "Administrator",
        },
      },
    });
  }

  res.json({
    ReceiptData: data,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

app.listen(7778, () => console.log("ready"));
