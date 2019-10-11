export const formatLargeNumber = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const formatStatusName = (name) => {
  switch (name) {
    case 'UNDER_REVIEW':
      return 'Under review';
    case 'NOT_REVIEWED':
      return 'Not reviewed';
    case 'REVIEWED':
      return 'Reviewed';
    case 'REJECTED':
      return 'Rejected';
    default:
      return 'Not reviewed';
  }
};

export const getSecondsSinceEpoch = () => Math.floor(Date.now() / 1000);