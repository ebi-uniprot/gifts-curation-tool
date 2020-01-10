export const formatLargeNumber = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const statusesList = [{
  id: 1,
  description: 'NOT_REVIEWED',
  formatted: 'Not Reviewed',
}, {
  id: 2,
  description: 'UNDER_REVIEW',
  formatted: 'Under Review',
}, {
  id: 3,
  description: 'REVIEWED',
  formatted: 'Reviewed',
}, {
  id: 4,
  description: 'REJECTED',
  formatted: 'Rejected',
}, {
  id: 5,
  description: 'UNIPROT_REVIEW',
  formatted: 'For UniProt Review',
}, {
  id: 6,
  description: 'ENSEMBL_REVIEW',
  formatted: 'For Ensembl Review',
}, {
  id: 7,
  description: 'REFSEQ_REVIEW',
  formatted: 'For RefSeq Review',
}, {
  id: 8,
  description: 'HGNC_REVIEW',
  formatted: 'For HGNC Review',
}];

export const formatStatusName = (name, statuses) => statuses
  .find(s => s.description === name)
  .formatted;

export const getSecondsSinceEpoch = () => Math.floor(Date.now() / 1000);

export const setModalVisibility = (visible = false) => {
  const body = document.getElementsByTagName('body')[0];
  const modalClassName = 'active-modal';

  if (visible) {
    // duplicated values are ignored
    body.classList.add(modalClassName);
  } else {
    // non-existing values won't throw exceptions
    body.classList.remove(modalClassName);
  }
};
