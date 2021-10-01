import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";

import "../../styles/Filters.scss";

const filtersStructure = {
  status: {
    label: "Status",
    value: "status",
    order: 1,
    heading: true,
    items: {
      not_reviewed: {
        label: "Not Reviewed",
        value: "status:NOT_REVIEWED",
        order: 1,
        group: "status",
      },
      reviewed: {
        label: "Reviewed",
        value: "status:REVIEWED",
        order: 2,
        group: "status",
      },
      uniprot_review: {
        label: "UniProt Review",
        value: "status:UNIPROT_REVIEW",
        order: 3,
        group: "status",
      },
      under_review: {
        label: "Under Review",
        value: "status:UNDER_REVIEW",
        order: 4,
        group: "status",
      },
    },
  },
  organism: {
    label: "Organism",
    value: "organism",
    order: 2,
    heading: true,
    items: {
      9606: {
        label: "Homo sapiens",
        value: "organism:9606",
        order: 1,
        group: "organism",
      },
      10090: {
        label: "Mus musculus",
        value: "organism:10090",
        order: 2,
        group: "organism",
      },
      4577: {
        label: "Zea mais",
        value: "organism:4577",
        order: 3,
        group: "organism",
      },
      10116: {
        label: "Rat",
        value: "organism:10116",
        order: 4,
        group: "organism",
      },
      3847: {
        label: "Glycine max",
        value: "organism:3847",
        order: 5,
        group: "organism",
      },
      7955: {
        label: "Danio rerio",
        value: "organism:7955",
        order: 6,
        group: "organism",
      },
    },
  },
  mappings: {
    label: "Mappings",
    value: "mappings",
    order: 3,
    heading: true,
    items: {
      mapped: {
        label: "Mapped",
        value: "type:mapped",
        order: 1,
        subheading: true,
        group: "mappings",
        items: {
          identical: {
            label: "Identical",
            value: "alignment:identical",
            order: 1,
            group: "alignment",
          },
          small: {
            label: "Small Diff.",
            value: "alignment:small",
            order: 2,
            group: "alignment",
          },
          large: {
            label: "Large Diff.",
            value: "alignment:large",
            order: 3,
            group: "alignment",
          },
        },
      },
      partial: {
        label: "Partially Mapped",
        value: "type:potentially_associated",
        order: 2,
        subheading: true,
        group: "mappings",
        items: {
          by_gene: {
            label: "By Gene",
            value: "type:potentially_associated",
            order: 1,
            group: "type",
          },
          by_isoform: {
            label: "By Isoform",
            value: "type:related_by_isoform",
            order: 2,
            group: "type",
          },
        },
      },
      unmapped: {
        label: "Unmapped",
        value: "type:unmapped",
        order: 3,
        subheading: true,
        group: "mappings",
      },
    },
  },
  patches: {
    label: "Patches",
    value: "patches",
    order: 4,
    heading: true,
    items: {
      exclude: {
        label: "Exclude",
        value: "patches:exclude",
        order: 1,
        group: "patches",
      },
      only: {
        label: "Only Patches",
        value: "patches:only",
        order: 2,
        group: "patches",
      },
    },
  },
  chromosome: {
    label: "Chromosome",
    value: "chromosome",
    order: 5,
    specificTo: "organism",
    items: {
      "organism:9606": {
        items: {
          1: {
            label: "1",
            value: "chromosomes:1",
            order: 1,
            group: "chromosome",
          },
          2: {
            label: "2",
            value: "chromosomes:2",
            order: 2,
            group: "chromosome",
          },
          3: {
            label: "3",
            value: "chromosomes:3",
            order: 3,
            group: "chromosome",
          },
          4: {
            label: "4",
            value: "chromosomes:4",
            order: 4,
            group: "chromosome",
          },
          5: {
            label: "5",
            value: "chromosomes:5",
            order: 5,
            group: "chromosome",
          },
          6: {
            label: "6",
            value: "chromosomes:6",
            order: 6,
            group: "chromosome",
          },
          7: {
            label: "7",
            value: "chromosomes:7",
            order: 7,
            group: "chromosome",
          },
          8: {
            label: "8",
            value: "chromosomes:8",
            order: 8,
            group: "chromosome",
          },
          9: {
            label: "9",
            value: "chromosomes:9",
            order: 9,
            group: "chromosome",
          },
          10: {
            label: "10",
            value: "chromosomes:10",
            order: 10,
            group: "chromosome",
          },
          11: {
            label: "11",
            value: "chromosomes:11",
            order: 11,
            group: "chromosome",
          },
          12: {
            label: "12",
            value: "chromosomes:12",
            order: 12,
            group: "chromosome",
          },
          13: {
            label: "13",
            value: "chromosomes:13",
            order: 13,
            group: "chromosome",
          },
          14: {
            label: "14",
            value: "chromosomes:14",
            order: 14,
            group: "chromosome",
          },
          15: {
            label: "15",
            value: "chromosomes:15",
            order: 15,
            group: "chromosome",
          },
          16: {
            label: "16",
            value: "chromosomes:16",
            order: 16,
            group: "chromosome",
          },
          17: {
            label: "17",
            value: "chromosomes:17",
            order: 17,
            group: "chromosome",
          },
          18: {
            label: "18",
            value: "chromosomes:18",
            order: 18,
            group: "chromosome",
          },
          19: {
            label: "19",
            value: "chromosomes:19",
            order: 19,
            group: "chromosome",
          },
          20: {
            label: "20",
            value: "chromosomes:20",
            order: 20,
            group: "chromosome",
          },
          21: {
            label: "21",
            value: "chromosomes:21",
            order: 21,
            group: "chromosome",
          },
          22: {
            label: "22",
            value: "chromosomes:22",
            order: 22,
            group: "chromosome",
          },
          mt: {
            label: "MT",
            value: "chromosomes:mt",
            order: 23,
            group: "chromosome",
          },
          x: {
            label: "X",
            value: "chromosomes:x",
            order: 24,
            group: "chromosome",
          },
          y: {
            label: "Y",
            value: "chromosomes:y",
            order: 25,
            group: "chromosome",
          },
        },
      },
      "organism:10090": {
        items: {
          1: {
            label: "1",
            value: "chromosomes:1",
            order: 1,
            group: "chromosome",
          },
          2: {
            label: "2",
            value: "chromosomes:2",
            order: 2,
            group: "chromosome",
          },
          3: {
            label: "3",
            value: "chromosomes:3",
            order: 3,
            group: "chromosome",
          },
          4: {
            label: "4",
            value: "chromosomes:4",
            order: 4,
            group: "chromosome",
          },
          5: {
            label: "5",
            value: "chromosomes:5",
            order: 5,
            group: "chromosome",
          },
          6: {
            label: "6",
            value: "chromosomes:6",
            order: 6,
            group: "chromosome",
          },
          7: {
            label: "7",
            value: "chromosomes:7",
            order: 7,
            group: "chromosome",
          },
          8: {
            label: "8",
            value: "chromosomes:8",
            order: 8,
            group: "chromosome",
          },
          9: {
            label: "9",
            value: "chromosomes:9",
            order: 9,
            group: "chromosome",
          },
          10: {
            label: "10",
            value: "chromosomes:10",
            order: 10,
            group: "chromosome",
          },
          11: {
            label: "11",
            value: "chromosomes:11",
            order: 11,
            group: "chromosome",
          },
          12: {
            label: "12",
            value: "chromosomes:12",
            order: 12,
            group: "chromosome",
          },
          13: {
            label: "13",
            value: "chromosomes:13",
            order: 13,
            group: "chromosome",
          },
          14: {
            label: "14",
            value: "chromosomes:14",
            order: 14,
            group: "chromosome",
          },
          15: {
            label: "15",
            value: "chromosomes:15",
            order: 15,
            group: "chromosome",
          },
          16: {
            label: "16",
            value: "chromosomes:16",
            order: 16,
            group: "chromosome",
          },
          17: {
            label: "17",
            value: "chromosomes:17",
            order: 17,
            group: "chromosome",
          },
          18: {
            label: "18",
            value: "chromosomes:18",
            order: 18,
            group: "chromosome",
          },
          19: {
            label: "19",
            value: "chromosomes:19",
            order: 19,
            group: "chromosome",
          },
          mt: {
            label: "MT",
            value: "chromosomes:mt",
            order: 23,
            group: "chromosome",
          },
          x: {
            label: "X",
            value: "chromosomes:x",
            order: 24,
            group: "chromosome",
          },
          y: {
            label: "Y",
            value: "chromosomes:y",
            order: 25,
            group: "chromosome",
          },
        },
      },
    },
  },
};

class Filters extends Component {
  createFilterHeading = (item) => (
    <h4 key={`filter-heading-${item.label}`}>{`${item.label}`}</h4>
  );

  createFilterSubHeading = (item) => {
    const { selectedFilters, toggleFilter } = this.props;
    const { label, value, group } = item;

    return (
      <Fragment key={`filter-subheading-${value}`}>
        <div>
          <input
            id={`filter-${value}`}
            type="checkbox"
            className="filters__item--subheading"
            defaultChecked={
              selectedFilters[group] && selectedFilters[group][value]
            }
            onChange={() => toggleFilter(item)}
          />
          <label htmlFor={`filter-${value}`}>{`${label}`}</label>
        </div>
      </Fragment>
    );
  };

  createSpecificToFilter = (item) => {
    const { selectedFilters } = this.props;
    const output = [];

    if (!selectedFilters[item.specificTo]) {
      return null;
    }

    Object.keys(item.items).forEach((key) => {
      if (selectedFilters[item.specificTo][key]) {
        output.push(this.createFilterHeading(item));

        Object.values(item.items[key]).forEach((i) => {
          Object.values(i).forEach((v) => {
            output.push(this.createSpecificToFilterItem(v));
          });
        });
      }
    });

    return output;
  };

  createSpecificToFilterItem = (item) => {
    const { selectedFilters, toggleFilter } = this.props;
    const { label, value, group } = item;

    return (
      <li key={`filter-item-${value}`}>
        <div>
          <input
            id={`filter-${value}`}
            type="checkbox"
            className="filters__item"
            defaultChecked={
              selectedFilters[group] && selectedFilters[group][value]
            }
            onChange={() => toggleFilter(item)}
          />
          <label htmlFor={`filter-${value}`}>{`${label}`}</label>
        </div>
      </li>
    );
  };

  createItem = (item) => {
    const { selectedFilters, toggleFilter } = this.props;
    const { label, value, group } = item;

    return (
      <Fragment key={`filter-item-${value}`}>
        <div>
          <input
            id={`filter-${value}`}
            type="checkbox"
            className="filters__item"
            defaultChecked={
              selectedFilters[group] && selectedFilters[group][value]
            }
            onChange={() => toggleFilter(item)}
          />
          <label htmlFor={`filter-${value}`}>{`${label}`}</label>
        </div>
      </Fragment>
    );
  };

  renderList = (list) => {
    const createListElement = (item) => {
      const output = [];

      if (item.heading) {
        output.push(this.createFilterHeading(item));
        output.push(this.renderList(item.items));
      } else if (item.subheading) {
        output.push(this.createFilterSubHeading(item));
        output.push(this.renderList(item.items));
      } else if (item.specificTo) {
        const specificToFilter = this.createSpecificToFilter(item);

        if (specificToFilter) {
          output.push(specificToFilter.shift());
        }

        output.push(
          <ul key={`filter-list-${list.value}`}>{specificToFilter}</ul>
        );
      }

      return output;
    };

    return (
      <ul key={`filter-list-${list.value}`}>
        {Object.values(list).map((l) => {
          if (l.items) {
            return <li key={l.value}>{createListElement(l)}</li>;
          }

          return <li key={l.value}>{this.createItem(l)}</li>;
        })}
      </ul>
    );
  };

  render() {
    return <div className="filters">{this.renderList(filtersStructure)}</div>;
  }
}

Filters.propTypes = {
  selectedFilters: PropTypes.shape({}).isRequired,
  toggleFilter: PropTypes.func.isRequired,
};

export default Filters;
