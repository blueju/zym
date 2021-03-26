const tradeElement = (request, response) => {
  const { tradeCode } = request.query;
  // 起始位
  let startBit;
  switch (tradeCode) {
    case 'MER-164978':
      startBit = 1;
      break;
    case 'MER-164979':
      startBit = 4;
      break;
    case 'MER-164980':
      startBit = 7;
      break;
  }
  let tradeElement = [...Array(3)].map((item, index) => {
    return {
      element: `交易要素 ${startBit + index}`,
      checked: false,
    };
  });
  response.json(tradeElement);
};
export default tradeElement;
