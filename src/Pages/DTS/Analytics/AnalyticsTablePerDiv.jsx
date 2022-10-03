import { act } from "@testing-library/react";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "reactstrap";
import { getOffices } from "../../../features/Portal/officesSlice";
import { getUser } from "../../../features/Portal/userSlice";
import { ContentSearch } from "../../../Layouts/Portal";

const _ = require("lodash");
const AnalyticsTablePerDiv = ({ setAnalytics, analytics, analyticsData, reports }) => {
  const dispatch = useDispatch();

  const { offices } = useSelector((state) => state.offices);
  const { user } = useSelector((state) => state.user);
  const [controlledOffices, setOffices] = useState([]);
  const [searchValue, setSearch] = useState("");

  const onSelectOffice = (e) => {
    const row = e.target;
    const office = row.parentElement.getAttribute("data-office");

    const updateAnalytics = analyticsData.map((data) => {
      if (office === data.office_code) {
        return {
          data: [
            ["Category", "Count"],
            ["Pending Communication", data.data[1][1]],
            ["Completed Communication", data.data[2][1]],
          ],
          total: data.total,
          active: true,
          office_code: data.office_code,
          com_ids: data.com_ids
        };
      } else {
        return {
          data: [
            ["Category", "Count"],
            ["Pending Communication", data.data[1][1]],
            ["Completed Communication", data.data[2][1]],
          ],
          total: data.total,
          active: false,
          office_code: data.office_code,
          com_ids: data.com_ids
        };
      }
    });

    setAnalytics([...updateAnalytics]);
  };
  useEffect(() => {
    dispatch(getOffices());
  }, [dispatch]);

  useEffect(() => {
    let officesUnderAll = [];

    let officesUnder = offices.filter((office) => {
      return office.office_under === user.office_code;
    });

    officesUnderAll = offices
      .filter((office) => {
        return (
          officesUnder
            .map((data) => data.office_code)
            .includes(office.office_under) ||
          office.office_code === user.office_code ||
          office.office_under === user.office_code
        );
      })
      .map((office) => office)
      .filter((office) => office.office_code !== "ORED");

    if (!_.isEmpty(user)) {
      if (user.role_name.includes("Process-level")) {
        setOffices(offices);
      } else {
        // console.log(officesUnderAll)
        setOffices(officesUnderAll);
      }
    }
  }, [offices, user]);

  useEffect(() => {
    const offices = controlledOffices.map(data => data.office_code);

    const analyticsPerOffice = analytics.filter(data => offices.includes(data.office_code)).map((analytics_data, index) => {
        return {
        data: [
          ["Category", "Count"],
          ["Pending Communication", analytics_data.total - analytics_data.completed],
          ["Completed Communication", analytics_data.completed],
        ],
        total: analytics_data.total,
        active:
          index === 0 &&
          !_.isEmpty(user) &&
          !user.role_name.includes("Process-level"),
        office_code: analytics_data.office_code,
        com_ids: analytics_data.com_ids
      };
    })

    if (!_.isEmpty(user) && user.role_name.includes("Process-level")) {
      const pending = reports.filter((rep) => {
        return _.isEmpty(rep.action_taken);
      }).length;

      const completed = reports.filter((rep) => {
        return !_.isEmpty(rep.action_taken);
      }).length;

      analyticsPerOffice.unshift({
        data: [
          ["Category", "Count"],
          ["Pending Communication", pending],
          ["Completed Communication", completed],
        ],
        total: pending + completed,
        active: true,
        office_code: "DA RFO2",
        office_group: null,
        com_ids: 'all'
      });
    }
    setAnalytics([...analyticsPerOffice]);
    // console.log(analyticsData)
  }, [offices]);
  const analyticsPerOffice = analyticsData
    .filter((data) => !_.isEmpty(data))
    .filter((data) =>
      data.office_code.toLowerCase().includes(searchValue.toLowerCase())
    )
    .map((item, index) => {
      return (
        <tr
          className={item.active ? "table-dark" : null}
          data-office={item.office_code}
          onClick={onSelectOffice}
          key={`${index}`}
        >
          <td key={`col_1_${index}`}>{item.office_code}</td>
          <td key={`col_2_${index}`}>{item.data[1][1]}</td>
          <td key={`col_3_${index}`}>{item.data[2][1]}</td>
          <td key={`col_4_${index}`}>{item.total}</td>
        </tr>
      );
    });

  const onSearchValueChange = (e) => {
    setSearch(e.target.value);
  };
  const clearSearch = (e) => {
    setSearch("");
  };

  return (
    <div style={{ overflowY: "auto", height: "80vh" }}>
      <ContentSearch
        placeholder={"Search Office"}
        searchValue={searchValue}
        onSearchValueChange={onSearchValueChange}
        clearSearch={clearSearch}
      />
      <br />
      <Table hover bordered striped>
        <thead>
          <tr>
            <th>OFFICE</th>
            <th>PENDING</th>
            <th>COMPLETED</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>{analyticsPerOffice}</tbody>
      </Table>
    </div>
  );
};

export default AnalyticsTablePerDiv;
