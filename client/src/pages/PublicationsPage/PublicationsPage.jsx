import { React, useEffect, useState } from "react";
import PublicationsCard from "./PublicationsCard";
import SearchBox from "../../components/Filtering/SearchBox";
import { searchInObject } from "../../utils/searchUtils";
import { sarcAPI } from "../../../../../shared/axios/axiosInstance";
import "./PublicationsPage.scss";

const PublicationsPage = () => {
  const [PublicationsData, setPublicationsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPublications, setFilteredPublications] = useState([]);

  const getPublications = async () => {
    try {
      const response = await sarcAPI.get(
        `sarc/v0/publication/publication-list`
      );
      setPublicationsData(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const filterPublications = () => {
      if (!searchQuery.trim()) {
        setFilteredPublications(PublicationsData);
        return;
      }

      const query = searchQuery.toLowerCase();
      const filtered = PublicationsData.filter((Publication) =>
        searchInObject(Publication, query)
      );
      setFilteredPublications(filtered);
    };

    filterPublications();
  }, [searchQuery, PublicationsData]);

  useEffect(() => {
    getPublications();
  }, []);

  return (
    <div className="PublicationsPage">
      <div className="publications-header">
        <SearchBox
          key="publications"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          resultsCount={filteredPublications.length}
        />
      </div>

      <div className="publications-grid">
        {filteredPublications.map((publ_data, index) => (
          <PublicationsCard key={index} data={publ_data} />
        ))}

        {filteredPublications.length === 0 && (
          <div className="no-results">
            No publications found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationsPage;
