import { Button, CardContent, CardHeader, Divider } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useRef } from "react";
import useIsShortText from "../../../hooks/useIsShortText";
import useReadVocab from "../../../hooks/useReadVocab";
import useCreateVocab from "../../../hooks/useCreateVocab";

dayjs.locale("ko");

export default function DiaryCard({ diary, isLoggedIn, opened, onToggle }) {
  const dateForDisplay = diary.dateKey ?? diary.date ?? diary.createdAt;
  const formattedDate = diary.dateKey
    ? dayjs(diary.dateKey, "YYYY-MM-DD").format("M월 D일 dddd")
    : dayjs(dateForDisplay).format("M월 D일 dddd");
  const title = diary.title;
  const content = diary.content;
  const authorName = diary.author.name;
  const imageUrl = diary.image;

  const contentRef = useRef(null);
  const isShort = useIsShortText(contentRef);

  const titleClass = opened ? "entry-title" : "entry-title line-clamp-1";
  const contentClass =
    opened || isShort ? "entry-content" : "entry-content line-clamp-3";
  const cardClass = `card feed-card hoverlift ${
    opened ? "opened" : "collapsed"
  }`;

  const { vocabList } = useReadVocab();

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useCreateVocab(vocabList);

  return (
    <div className={cardClass}>
      <CardHeader
        title={
          <div className="entry-head">
            <p className={titleClass}>{title}</p>
          </div>
        }
      />
      <CardContent className={`card-body ${isShort ? "no-cta" : "has-cta"}`}>
        <p
          ref={contentRef}
          className={contentClass}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: "pointer" }}
        >
          {content}
        </p>
        {opened && imageUrl && (
          <div className="entry-image-wrap">
            <img className="entry-image" src={imageUrl} alt="diary" />
          </div>
        )}

        <div className="entry-meta-bottom">
          <span className="date">{formattedDate}</span>
          <span className="sep">|</span>
          <span className="author" title={authorName}>
            {authorName}
          </span>
        </div>

        {/* 2줄 이하이면 Divider/버튼 숨김 */}
        {!isShort && (
          <>
            <Divider className="entry-divider" />
            {isLoggedIn ? (
              <Button
                onClick={onToggle}
                variant="outlined"
                fullWidth
                className="btn-outline subtle"
                sx={{ fontWeight: 700 }}
              >
                {opened ? "접기" : "전체 읽기"}
              </Button>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                fullWidth
                className="btn-outline subtle"
                sx={{ fontWeight: 700 }}
              >
                전체 읽기
              </Button>
            )}
          </>
        )}
      </CardContent>
    </div>
  );
}
