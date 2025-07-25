import type { Document } from "../../interfaces/Document";
import DocumentCard from "./DocumentCard";
import { Loader, Pagination } from "@mantine/core";
import "./DocumentList.css";

const DocumentsList = (
  {
    documents,
    onEdit,
    page,
    setPage,
    totalPages,
    onDelete,
    isLoading,
  }: {
    documents?: Document[],
    onEdit?: (document: Document) => void,
    page?: number,
    setPage?: (page: number) => void,
    onDelete?: (document: Document) => void,
    totalPages?: number,
    isLoading: boolean,
  }
) => {

  let id = 0;

  const generateId = () => {
    id++;
    return id;
  }

  return (
    <div className="document-list-wrapper">
      {isLoading && <Loader className="document-list-loader" size="xl" />}
      {!isLoading && (
        <div className="document-card-list-container">

          {documents?.map((document) => (
            <div className="document-card" key={generateId()}>
              <DocumentCard
                document={document}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          ))}
        </div>
      )}
      <div className="document-card-list-container-pagination">
        <Pagination
          total={totalPages || 0}
          value={page}
          onChange={setPage}
          siblings={1}
          withEdges
          withPages
        />
      </div>
    </div>
  );
};

export default DocumentsList;