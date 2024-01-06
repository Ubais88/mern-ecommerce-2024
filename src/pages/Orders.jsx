import React, { ReactElement, useState } from "react";
import TableHOC from "../components/admin/TableHOC";
import { Link } from "react-router-dom";

// type DataType = {
//   _id: string;
//   amount: number;
//   quantity: number;
//   discount: number;
//   status: ReactElement;
//   action: ReactElement;
// };

const column = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Orders = () => {
    const [rows] = useState([
        { 
            _id: 'asds',
            amount: 1232,
            quantity: 3,
            discount: 56,
            status: <span className="red">processing</span>,
            action: <Link to={`/order/asds`}>View</Link>,
        }
    ])
  const Table = TableHOC(
    column,
    rows,
    "dashboard-product-box",
    "Orders",
    rows.length > 6
  )();
  return (
    <div className="container">
      <h1>My Orders</h1>
      {Table}
    </div>
  );
};

export default Orders;
