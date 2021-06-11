import express from "express";
import * as crypto from "crypto";
import faker from "faker";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  if (req.header("x-api-key") !== "hjgtmnbkj65796097ihgqECVBaaqc") {
    return res.status(401).json({ message: "unauthorized" });
  }
  next();
});

app.get("/", (req, res) => {
  res.json({ health: "ok" });
});

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
          dataJPK: faker.date.past(),
        },
        podmiot1: {
          NIP: faker.datatype.number({ min: 10000000000, max: 99999999999 }),
          nazwaPod: faker.company.companyName(),
          adresPod: {
            kodPoczt: faker.address.zipCode(),
            miejsc: faker.address.city(),
            nrDomu: faker.datatype.number({ min: 1, max: 90 }),
            ulica: faker.address.streetName(),
          },
          nrUnik: "WAH2001009137",
          nrFabr: "WAH2001009137",
          nrEwid: "2021/000005699",
        },
        paragon: {
          JPKID: i + 1,
          pamiecChr: 1,
          nrDok: faker.datatype.number({ min: 100, max: 5000 }),
          nrParag: faker.datatype.number({ min: 1, max: 1000 }),
          nrKasy: faker.datatype.number({ min: 1, max: 1000 }),
          zakSprzed: faker.date.past(),
          kasjer: faker.name.firstName() + " " + faker.name.lastName(),
          stPTU: taxes,
          pozycja: [...Array(faker.datatype.number({ min: 1, max: 10 }))].map(
            () => {
              const tax = faker.random.arrayElement(taxes);
              return {
                towar: {
                  nazwa: faker.commerce.product(),
                  brutto: faker.datatype.number({ min: 100, max: 5000 }),
                  cena: faker.datatype.number({ min: 100, max: 5000 }),
                  idStPTU: tax.id,
                  ilosc: faker.datatype.number({ min: 1, max: 10 }),
                },
              };
            }
          ),
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

app.listen(process.env.PORT || 7778, () => console.log("ready"));

const taxes = [
  {
    id: "A",
    wart: 2300,
  },
  {
    id: "B",
    wart: 800,
  },
  {
    id: "C",
    wart: 500,
  },
  {
    id: "D",
    wart: 0,
  },
  {
    id: "E",
    wart: 0,
  },
];
