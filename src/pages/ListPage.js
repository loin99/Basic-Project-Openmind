import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSubjects } from "../apis/GetSubjects";
import { BeatLoader } from "react-spinners";
import styles from "./ListPage.module.css";
import useWindowSize from "../utils/useWindowSize";
import UserCard from "../public_components/UserCard";
import ButtonLightAnswer from "../public_components/ButtonLightAnswer";
import Sort from "../public_components/Sort";
import Pagination from "../public_components/Pagination";
import ButtonDark from "../public_components/ButtonDark";
import LogoImage from "../assets/Images/logo.svg";
import EmptyBox from "../assets/Images/empty.png";
import IcMessage from "../assets/Icon/messages.svg";

function ListPage() {
  const [order, setOrder] = useState("createdAt");

  const [items, setItems] = useState({ results: [] });
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [count, setCount] = useState(0);
  const { width } = useWindowSize();

  const sortedItems = [...items.results].sort((a, b) => {
    if (order === "createdAt") {
      return b[order] - a[order];
    } else if (order === "name") {
      return a.name.localeCompare(b.name, "ko");
    }
  });

  const handleLoad = async (options) => {
    setLoading(true);
    try {
      const response = await getSubjects({ ...options, order, limit });
      if (response && response.results) {
        setItems({ results: response.results });
        setCount(response.count);
        setTotalPages(Math.ceil(response.count / limit));
      } else {
        setItems({ results: [] });
      }
    } catch (error) {
      console.error("데이터를 불러오는데 실패하였습니다.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (width >= 868) {
      setLimit(8);
    } else {
      setLimit(6);
    }
  }, [width]);

  useEffect(() => {
    handleLoad({ offset: (currentPage - 1) * limit });
  }, [order, currentPage, limit]);

  return (
    <div className={styles.list_wrap}>
      <nav className={styles.list_top}>
        <Link to="/">
          <img src={LogoImage} alt="로고 이미지" className={styles.list_logo} />
        </Link>
        <ButtonLightAnswer>답변하러 가기</ButtonLightAnswer>
      </nav>
      <section className={styles.list_body}>
        <div className={styles.list_body_top}>
          <h1>누구에게 질문할까요?</h1>
          <Sort setOrder={setOrder} />
        </div>
        {loading ? (
          <div className={styles.loading}>
            <BeatLoader color="#542F1A" />
            <p>데이터를 불러오고 있습니다.</p>
          </div>
        ) : items.results.length === 0 ? (
          <div className={styles.empty_item}>
            <p>
              <img src={IcMessage} alt="메시지 아이콘" />
              아직 답변자가 없습니다.
            </p>
            <EmptyBox alt="빈박스 이미지" />
            <ButtonDark disabled={false}>메인페이지로 이동하기</ButtonDark>
          </div>
        ) : (
          <>
            <UserCard items={sortedItems} />
            <Pagination
              setCurrentPage={setCurrentPage}
              handleLoad={handleLoad}
              limit={limit}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </>
        )}
      </section>
    </div>
  );
}

export default ListPage;
