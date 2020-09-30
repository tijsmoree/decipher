// Distribution of the alphabet
// characters in the English language
const englishDistribution = {
  a: 8.2,
  b: 1.5,
  c: 2.8,
  d: 4.2,
  e: 12.7,
  f: 2.2,
  g: 2,
  h: 6.1,
  i: 7,
  j: 0.1,
  k: 0.8,
  l: 4,
  m: 2.4,
  n: 6.7,
  o: 7.5,
  p: 1.9,
  q: 0.1,
  r: 6,
  s: 6.3,
  t: 9,
  u: 2.8,
  v: 1,
  w: 2.4,
  x: 0.1,
  y: 2,
  z: 0.1,
};

// An array of the alphabet characters
const alphabet = Object.keys(
  englishDistribution,
);

// Returns the factor numbers of an integer
const getFactors = value =>
  Array.from(Array(value + 1))
    .map((_, i) => i)
    .filter(i => i !== 1 && value % i === 0);

// Returns the lowercase alpha characters
// of a string
const simple = text =>
  text.toLowerCase().replace(/[^a-z]/gi, '');

// Returns an array with the distribution
// of the characters in a string
const findDistribution = cipher => {
  const reduced = simple(cipher);

  const distribution = {};
  for (const c of alphabet) {
    distribution[c] = 0;
  }

  for (const char of reduced) {
    if (!distribution[char]) {
      distribution[char] = 0;
    }

    distribution[char] +=
      100 / reduced.length;
  }

  return distribution;
};

// Returns the most probable offset between
// two distributions of alpha characters
const findDistributionDistance = (a, b) => {
  const distances = [];
  for (let i = 0; i < 25; i++) {
    let distance = 0;

    for (
      let j = 0;
      j < alphabet.length;
      j++
    ) {
      distance +=
        Math.abs(
          a[alphabet[(j + i) % 26]] -
            b[alphabet[j]],
        ) / 2;
    }

    distances.push(distance);
  }

  return distances.indexOf(
    Math.min(...distances),
  );
};

// Decodes a cipher created using a shift
// pattern
const decodeShift = cipher => {
  const distribution = findDistribution(
    cipher,
  );
  const offset = findDistributionDistance(
    distribution,
    englishDistribution,
  );

  let text = '';

  for (const c of cipher) {
    if (alphabet.includes(c)) {
      text +=
        alphabet[
          (alphabet.indexOf(c) -
            offset +
            26) %
            26
        ];
    } else {
      text += c;
    }
  }

  return [text, offset];
};

// Returns the most probable keyword
// length of a cipher created
// using a Vigenere cipher
const findKasiski = cipher => {
  const n = 3;
  const reduced = simple(cipher);

  const groups = {};
  for (
    let i = 0;
    i < reduced.length - n + 1;
    i++
  ) {
    const group = reduced.substr(i, n);

    if (!(group in groups)) {
      groups[group] = [];
    }

    groups[group].push(i);
  }

  const primes = [];
  for (const group in groups) {
    const array = groups[group];

    for (
      let i = 0;
      i < array.length - 1;
      i++
    ) {
      primes.push(
        ...getFactors(
          array[i + 1] - array[i],
        ),
      );
    }
  }

  const factors = {};
  for (const prime in primes) {
    if (!(primes[prime] in factors)) {
      factors[primes[prime]] = 0;
    }

    factors[primes[prime]]++;
  }

  let biggest = null;
  for (const factor in factors) {
    if (
      factors[factor] >
      (factors[biggest] || 0)
    ) {
      biggest = factor;
    }
  }

  return Number(biggest);
};

// Decodes a cipher, created using
// a Vigenere pattern
const decodeVigenere = cipher => {
  const kasiski = findKasiski(cipher);

  const reduced = simple(cipher);

  const offsets = Array.from(
    Array(kasiski),
  ).map((_, i) => i);

  const deciphered = [];
  const key = [];
  for (const o of offsets) {
    let cipherPart = '';

    for (
      let i = o;
      i < reduced.length;
      i += kasiski
    ) {
      cipherPart += reduced.charAt(i);
    }

    const [text, offset] = decodeShift(
      cipherPart,
    );

    deciphered.push(text);
    key.push(alphabet[offset]);
  }

  let text = '';
  for (
    let i = 0;
    i < deciphered[0].length;
    i++
  ) {
    for (const o of deciphered) {
      text += o.charAt(i);
    }
  }

  let i = 0;
  return [
    cipher.replace(/[a-zA-Z]/gi, () =>
      text.charAt(i++),
    ),
    key.join(''),
  ];
};

const cipher1 = `lww esp hzcwod l delrp lyo lww esp xpy lyo hzxpy xpcpwj awljpcd espj slgp
esptc pited lyo esptc pyeclynpd lyo zyp xly ty std etxp awljd xlyj alced`;
const [text1, key1] = decodeShift(cipher1);
console.log(
  `Shift cipher with offset of ${key1}:\n${text1}\n`,
);

const cipher2 = `gv srbxmghp mteyljviikw hm Whtbilwiakvw iseyl rvx rrope xh lbilk xhkey bk
ml hgtnrpef xhteol as a zisnw sf ttxhyw fkfq Loekxjtxhvel tsfwenr klta ae arzx
hfonk ltsj oy klx wparj em hpl myir jslevgmlh tavq yvv pnspbjetbfr tmxek jltrisivekl hixu tklwekmmgn xhx gptfw tavwx dvimzrzz aekv fkvygak xhnitavv bu
ahtk ml rrope el ale yzvla joezs loekxjtxhvel cizhgy bj el ymca rrw kmvxiwx hw
hbj ahyo hbj tehcs arzx ztapeiw jsugkpxzw awrtmhxihew tjvolj qnsxiici zlrrxj
egk guekyklw hbj tehcs arzx oed te igkyrbek iyisxegx vr smrkx hrd yzpf oms
pimmprgl yeol fexe ghttievh bu zakzsnz mtxiempsnl fj moi chdtelxe pfvdz sf
pzpepem Lyedlwpxrvx dlivy mgjpuwv ees sf azw iseyl jsguitl rrw vxhxi thlqs
pzpepem lyedlwpxrvx jsnmzrnlw th si hui oy klx tssm zqivvttex epxekrvr mmgniil vj tav ignpily ptukutxi`;
const [text2, key2] = decodeVigenere(
  cipher2,
);
console.log(
  `Vigenere cipher with key '${key2}':\n${text2}\n`,
);
