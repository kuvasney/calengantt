import { useMemo } from "react";
import type { Comments } from "@/types/project";
import { formatDateTime } from "@/utils/dateFormatter";
import "./comments.scss";

export default function Comments({
  stepId,
  comments,
}: {
  stepId?: number;
  comments: Comments[];
}) {
  const filteredComments = useMemo(() => {
    if (stepId) {
      return comments.filter(
        (comment: { stepId: number }) => comment.stepId === stepId
      );
    } else {
      return comments.filter(
        (comment: { stepId: number }) => comment.stepId === null
      );
    }
  }, [comments, stepId]);

  return (
    <section className="comments">
      <h3 className="comments__title">Discussão</h3>
      {filteredComments.length === 0 && <p>Nenhum comentário.</p>}
      <ul className="comments__list">
        {filteredComments.map((comment) => (
          <li key={comment.id} className="comments__item">
            <div className="comments__author">
              <strong>{comment.userName}</strong>{" "}
              <span className="comments__date">
                {formatDateTime(comment.createdAt)}
              </span>
            </div>
            <div>
              {comment.text.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <form className="form-regular comments__form">
        <div className="form-field">
          <textarea
            className="comments__textarea"
            placeholder="Escreva seu comentário..."
          ></textarea>
        </div>
        <div className="form-field">
          <button className="btn-default comments__submit" type="submit">
            Enviar
          </button>
        </div>
      </form>
    </section>
  );
}
