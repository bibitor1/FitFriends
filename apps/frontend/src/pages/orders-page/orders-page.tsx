import Header from '../../components/header/header';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { getOrders } from '../../redux/userSlice/selectors';
import {
  AppRoute,
  Pagination,
  SortDirection,
} from '../../constants';
import { ArrowLeft, IconSortDown, IconSortUp } from '../../helper/svg-const';
import OrderItem from '../../components/order-item/order-item';
import { fetchOrdersAction } from '../../redux/userSlice/apiUserActions';

function OrdersPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentOrders = useAppSelector(getOrders);

  const [ordersPage, setOrdersPage] = useState(1);
  const pagesCount = Math.ceil(
    currentOrders.length / Pagination.maxOrdersCountPerPage,
  );

  const [moneySelectedSortDirection, setMoneySelectedSortDirection] =
    useState<SortDirection>(SortDirection.Desc);
  const [quantitySelectedSortDirection, setQuantitySelectedSortDirection] =
    useState<SortDirection>(SortDirection.Desc);

  const handleSortForMoneyButtonClick = () => {
    setMoneySelectedSortDirection((prevState) =>
      prevState === SortDirection.Desc ? SortDirection.Asc : SortDirection.Desc,
    );
    dispatch(
      fetchOrdersAction({
        priceSort: moneySelectedSortDirection,
      }),
    );
  };

  const handleSortForQuantityButtonClick = () => {
    setQuantitySelectedSortDirection((prevState) =>
      prevState === SortDirection.Desc ? SortDirection.Asc : SortDirection.Desc,
    );
    dispatch(
      fetchOrdersAction({
        quantitySort: quantitySelectedSortDirection,
      }),
    );
  };

  const handleShowMoreButtonClick = () => {
    setOrdersPage((prevState) =>
      prevState < pagesCount ? prevState + 1 : prevState,
    );
  };

  const handleReturnToTopButtonClick = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    dispatch(fetchOrdersAction({ sortDirection: 'desc' }));
  }, [dispatch]);

  return (
    <>
      <Header />
      <main>
        <section className="my-orders">
          <div className="container">
            <div className="my-orders__wrapper">
              <button
                onClick={() => navigate(AppRoute.TrainerRoom)}
                className="btn-flat btn-flat--underlined my-orders__back"
                type="button"
              >
                <svg width="14" height="10" aria-hidden="true">
                  <ArrowLeft />
                </svg>
                <span>Назад</span>
              </button>
              <div className="my-orders__title-wrapper">
                <h1 className="my-orders__title">Мои заказы</h1>
                <div className="sort-for">
                  <p>Сортировать по:</p>
                  <div className="sort-for__btn-container">
                    <button
                      onClick={handleSortForMoneyButtonClick}
                      className="btn-filter-sort"
                      type="button"
                    >
                      <span>Сумме</span>
                      {moneySelectedSortDirection === SortDirection.Desc ? (
                        <svg width="16" height="10" aria-hidden="true">
                          <IconSortDown />
                        </svg>
                      ) : (
                        <svg width="16" height="10" aria-hidden="true">
                          <IconSortUp />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={handleSortForQuantityButtonClick}
                      className="btn-filter-sort"
                      type="button"
                    >
                      <span>Количеству</span>
                      {quantitySelectedSortDirection === SortDirection.Desc ? (
                        <svg width="16" height="10" aria-hidden="true">
                          <IconSortDown />
                        </svg>
                      ) : (
                        <svg width="16" height="10" aria-hidden="true">
                          <IconSortUp />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <ul className="my-orders__list">
                {currentOrders
                  .slice(0, ordersPage * Pagination.maxOrdersCountPerPage)
                  .map((order) => (
                    <OrderItem key={order.id} order={order} />
                  ))}
              </ul>
              <div className="show-more my-orders__show-more">
                {ordersPage >= pagesCount ? (
                  <button
                    onClick={handleReturnToTopButtonClick}
                    className={`btn show-more__button ${
                      pagesCount <= 1 ? 'show-more__button--to-top' : ''
                    }`}
                  >
                    Вернуться в начало
                  </button>
                ) : (
                  <button
                    onClick={handleShowMoreButtonClick}
                    className="btn show-more__button show-more__button--more"
                    type="button"
                  >
                    Показать еще
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default OrdersPage;
