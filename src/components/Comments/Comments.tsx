import CommentsMock from "@/mocks/Comments.json";
import type { Project } from "@/types/project";
import { formatDateTime } from "@/utils/dateFormatter";
import "./comments.scss";

export default function Comments({
  selectedProject,
}: {
  selectedProject: Project;
}) {
  const filteredComments = CommentsMock.filter(
    (comment) => comment.projectId === selectedProject.id
  );

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
    </section>
  );
}
