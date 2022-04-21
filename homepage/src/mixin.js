export default {
  methods: {
    checkRankData(rank, score) {
      if (!rank || rank < 1) {
        alert('게임 기록이 없습니다.');
        return false;
      }
      if (!score || score < 1) {
        alert(
          '승점이 없어서 공유가 되지 않습니다. 플레이해서 승점을 올려주세요!'
        );
        return false;
      }

      return true;
    },

    numberWithCommas(x) {
      if (x !== null && x >= 0) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }

      return '--';
    },
  },
};
