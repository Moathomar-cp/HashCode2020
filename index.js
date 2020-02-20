const fs = require("fs");
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
function solveForFile(fileName) {
  // function
  const lines = fs
    .readFileSync(__dirname + "/" + fileName, "utf-8")
    .split("\n");

  const [booksCount, librariesCount, scaningDays] = lines
    .shift()
    .split(" ")
    .map(Number);

  const scoreOfBooks = lines
    .shift()
    .split(" ")
    .map(Number);

  const libConfigs = Array.from({ length: librariesCount }).map(
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

  solve({ booksCount, librariesCount, scaningDays, libConfigs, scoreOfBooks });

  function solve({
    booksCount,
    librariesCount,
    scaningDays,
    libConfigs,
    scoreOfBooks
  }) {
    const booksScore = libBooks =>
      libBooks.reduce((acc, l) => (acc += scoreOfBooks[l]), 0);

    const Wbook = 50;
    const WtoSign = 5;
    const WBookRank = 10;
    const orderByDate = libConfigs.sort((a, b) => {
      aRank =
        Wbook * a.libBooksCounts -
        WtoSign * a.libDaysToSign +
        (booksScore(a.libBookIds) / a.libBooksCounts) * WBookRank;
      bRank =
        Wbook * b.libBooksCounts -
        WtoSign * b.libDaysToSign +
        (booksScore(b.libBookIds) / b.libBooksCounts) * WBookRank;
      return bRank - aRank;
    });

    const ansArr = [];
    orderByDate.forEach(lib => {
      let booksToSendCount = scaningDays * lib.libBooksPerDay;
      booksToSendCount = Math.min(booksToSendCount, lib.libBooksCounts);

      const _local = lib.libBookIds
        // .filter(b => !scannedBooks[b])
        .sort((a, b) => scoreOfBooks[b] - scoreOfBooks[a])
        .slice(0, booksToSendCount);

      booksToSendCount = _local.length;
      if (booksToSendCount != 0) {
        // scannedBooks = { ...scannedBooks, ..._local };
        const row0 = lib.libIndex + " " + booksToSendCount;
        const row1 = _local.join(" ");
        ansArr.push(row0, row1);
      }
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
