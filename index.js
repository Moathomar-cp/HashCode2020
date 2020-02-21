const fs = require("fs");
const math = require("mathjs");
const fileNames = `a_example.txt
 b_read_on.txt
 c_incunabula.txt
 d_tough_choices.txt
 e_so_many_books.txt
 f_libraries_of_the_world.txt`
  .split("\n")
  //   .slice(0, 1)
  .filter(t => t && !t.includes(".out"))
  .map(fileName => fileName.trim())
  .map(solveForFile);
// console.log(fileNames);

fs.copyFileSync(__dirname + "/index.js", __dirname + "/out/index.js");
function solveForFile(fileName) {
  // function
  const lines = fs
    .readFileSync(__dirname + "/" + fileName, "utf-8")
    .split("\n");

  const [booksCount, librariesCount, scanningDays] = lines
    .shift()
    .split(" ")
    .map(Number);

  const scoreOfBooks = lines
    .shift()
    .split(" ")
    .map(Number);

  const librariesArr = Array.from({ length: librariesCount }).map(
    (_, libIndex) => {
      const [libBooksCounts, libDaysToSign, libBooksPerDay] = lines
        .shift()
        .split(" ")
        .map(Number);
      ``;
      const libBookIds = lines
        .shift()
        .split(" ")
        .map(Number);

      return {
        libIndex,
        libDaysToSign,
        libBooksCounts,
        libBooksPerDay,
        libBookIds
      };
    }
  );

  solve({ scanningDays, librariesArr, scoreOfBooks });

  function solve({ scanningDays, librariesArr, scoreOfBooks }) {
    let scannedBooks = {};

    const booksRankWait = 1;
    const Wbook = 3;
    const WtoSign = 1;

    const booksScore = libBooks => {
      const sum = libBooks.reduce((acc, l) => {
        return (acc += scoreOfBooks[l] * 1.7);
      }, 0);
      return booksRankWait * sum; 
    };

    const rankLibrary = lib =>
      Math.ceil(10 * (booksScore(lib.libBookIds) / lib.libDaysToSign));

    const orderByDateDesc = librariesArr.sort((a, b) => {
      return rankLibrary(b) - rankLibrary(a);
    });

    //reset to update score D: !
    scannedBooks = {};

    const ansArr = [];
    orderByDateDesc.forEach(lib => {
      if (scanningDays - lib.libDaysToSign < 0) return;
      let booksToSendCount =
        (scanningDays - lib.libDaysToSign) * lib.libBooksPerDay;
      booksToSendCount = Math.min(booksToSendCount, lib.libBooksCounts);
      const _local = lib.libBookIds
        .filter(b => !scannedBooks[b])
        .sort((a, b) => scoreOfBooks[b] - scoreOfBooks[a])
        .slice(0, booksToSendCount)
        .map(d => ((scannedBooks[d] = true), d));

      booksToSendCount = _local.length;
      if (booksToSendCount != 0) {
        scanningDays -= lib.libDaysToSign;
        const row0 = lib.libIndex + " " + booksToSendCount;
        const row1 = _local.join(" ");
        ansArr.push(row0, row1);
      }
      //   console.log(scannedBooks, _local);
    });
    ansArr.unshift(ansArr.length / 2);

    const answer = ansArr.join("\n");

    fs.writeFileSync(
      __dirname + "/out/" + fileName.replace("txt", "out"),
      answer,
      "utf-8"
    );
  }
}
