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
    .map(Number)
    // to Store
    // .map((score, i) => [i, score])
    // .sort((a, b) => b[1] - a[1]);

  const libConfigs = Array.from({ length: librariesCount }).map(
    (_, libIndex) => {
      const [libBooksCounts, libDaysToSign, libBooksPerDay] = lines
        .shift()
        .split(" ")
        .map(Number);

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
    const orderByDate = libConfigs
      // .filter(d => d.libDaysToSign < (scaningDays * 2) / 3)
      .sort((a, b) => a.libDaysToSign - b.libDaysToSign);

    const ansArr = [orderByDate.length];
    orderByDate.forEach(lib => {
      let booksToSendCount =
        (scaningDays - lib.libDaysToSign) * lib.libBooksPerDay;
      const row0 =
        lib.libIndex + " " + Math.min(booksToSendCount, lib.libBooksCounts);

      const row1 = lib.libBookIds.slice(0, booksToSendCount).join(" ");
      ansArr.push(row0, row1);
      //   console.log("Zoeooo", { booksToSendCount, scaningDays, lib, row0, row1 });
    });

    const answer = ansArr.join("\n");

    fs.writeFileSync(
      __dirname + "/out/" + fileName.replace("txt", "out"),
      answer,
      "utf-8"
    );
  }
}
