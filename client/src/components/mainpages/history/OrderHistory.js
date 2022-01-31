import React, { useContext, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import axios from "axios";

function OrderHistory() {
  const state = useContext(GlobalState);
  const [history, setHistory] = state.userAPI.history;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  useEffect(() => {
    if (token) {
      const getHistory = async () => {
        if (isAdmin) {
          const res = await axios.get("/api/payment", {
            headers: { Authorization: token },
          });
          setHistory(res.data);
        } else {
          const res = await axios.get("/user/history", {
            headers: { Authorization: token },
          });
          setHistory(res.data);
        }
      };
      getHistory();
    }
  }, [token, isAdmin, setHistory]);
  function SumOfOrders() {
    if (history.length === 1) {
      return "заказ";
    }
    if (history.length > 1 && history.length < 5) {
      return "заказа";
    }
    if (history.length >= 5) {
      return "заказов";
    }
  }

  return (
    <div className="history-page">
      <h2>История заказов</h2>

      <h4>
        У Вас {history.length} {SumOfOrders()}
      </h4>

      <table>
        <thead>
          <tr>
            <th>Индификатор платежа</th>
            <th>Дата оплаты</th>
            <th>Информация</th>
          </tr>
        </thead>
        <tbody>
          {history.map((items) => (
            <tr key={items._id}>
              <td>{items.paymentID}</td>
              <td>{new Date(items.createdAt).toLocaleDateString()}</td>
              <td>
                <Link to={`/history/${items._id}`}>Детали</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderHistory;
