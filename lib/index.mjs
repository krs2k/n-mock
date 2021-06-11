import express from "express";
import * as crypto from "crypto";
import faker from "faker";
import { addDays, set } from "date-fns";

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
  let { Limit, LastJPKID, UID } = req.body;
  LastJPKID = LastJPKID || 1;
  const data = [];

  for (let i = 1; i <= Limit; i++) {
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
          JPKID: LastJPKID + 1,
          pamiecChr: 1,
          nrDok: LastJPKID + 1,
          nrParag: LastJPKID + 1,
          nrKasy: 1,
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

app.post("/SDF3RestApi/api/GetDailyReport", (req, res) => {
  let { Limit, LastReportNo, UID } = req.body;
  LastReportNo = LastReportNo || 1;
  const data = [];

  for (let i = 1; i <= Limit; i++) {
    const startAt = set(new Date(faker.date.past()), {
      hours: "08",
      minutes: "00",
    });
    const endAt = set(startAt, { hours: "23", minutes: "00" });
    data.push({
      JPK: {
        naglowek: {
          wersja: "JPK_KASA_v2-0",
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
        content: [
          {
            rapDob: {
              JPKID: LastReportNo + i,
              pamiecChr: 1,
              nrDok: LastReportNo + i,
              nrRap: LastReportNo + i,
              rozpSprzed: startAt,
              zakSprzed: endAt,
              stPTU: taxes,
              sprzedPar: {
                sumaBrutto: faker.datatype.number({ min: 100, max: 5000 }),
                sumaPod: faker.datatype.number({ min: 100, max: 5000 }),
                wartWgPTU: [
                  {
                    idStPTU: "A",
                    netto: faker.datatype.number({ min: 100, max: 5000 }),
                    vat: faker.datatype.number({ min: 100, max: 5000 }),
                  },
                  {
                    idStPTU: "B",
                    netto: faker.datatype.number({ min: 100, max: 5000 }),
                    vat: faker.datatype.number({ min: 100, max: 5000 }),
                  },
                  {
                    idStPTU: "C",
                    netto: faker.datatype.number({ min: 100, max: 5000 }),
                    vat: faker.datatype.number({ min: 100, max: 5000 }),
                  },
                  {
                    idStPTU: "D",
                    netto: faker.datatype.number({ min: 100, max: 5000 }),
                    vat: faker.datatype.number({ min: 100, max: 5000 }),
                  },
                  {
                    idStPTU: "E",
                    netto: faker.datatype.number({ min: 100, max: 5000 }),
                    vat: faker.datatype.number({ min: 100, max: 5000 }),
                  },
                ],
                sprzedNO: faker.datatype.number({ min: 100, max: 5000 }),
              },
              podatekNal: faker.datatype.number({ min: 100, max: 5000 }),
              sprzedBrutto: faker.datatype.number({ min: 100, max: 5000 }),
              sprzedNO: faker.datatype.number({ min: 100, max: 5000 }),
              waluta: "PLN",
              sytAwaryjne: faker.datatype.number({ min: 0, max: 30 }),
              zdarzProgramL: faker.datatype.number({ min: 0, max: 30 }),
              zdarzProgramO: faker.datatype.number({ min: 0, max: 30 }),
              zmBazyTow: faker.datatype.number({ min: 0, max: 30 }),
              liczbaPar: faker.datatype.number({ min: 0, max: 30 }),
              liczbaParAnul: faker.datatype.number({ min: 0, max: 30 }),
              wartParAnul: faker.datatype.number({ min: 0, max: 30 }),
              dokNiefisk: faker.datatype.number({ min: 0, max: 30 }),
              zakRap: endAt,
              nrKasy: "0",
              kasjer: "Administrator",
              podpis: {
                RSA: "13D8DE58AEA0F534989F32E705E02D27B1CE40150B56830851E38D329A1D66B919224C7E3652D7E38D2C38B4B9DAB5774F70702D056808F88F15DC9F51382E03D5ED60A3E3F90BB67A4E39944CAC07A5CFCAF1A98BF7343F5735416912A460479C5CC558706196A2E3D4603CD7BD0E858C5244290CFBC0314A3DDFE69B9ECFCECFDE4B73635BBFF7DAF4291E2C6981E433773C7ED7CC6A7961277430A3857729BC13A89675AA455144C47003EA314AA0D6E4D823B4B60FDB865CA0241703A509E14365732B185392CB8EFC4D838F3AFDEDAB3D3147CCC411D56F4E60F8673943B69D9CAD7196FA49D40C950C714AFF8BDA5A07E5B3FC36882D4C5BECB0B70816",
                SHA: "E74D16B5FF7358172631925A8CB6AB87372D32AC43D32078E55E8E40EE82B68D",
              },
            },
          },
        ],
      },
    });
  }

  res.json({
    ReportsData: data,
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
