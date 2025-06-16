import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import {
  Container,
  Owner,
  Loading,
  BackButton,
  IssuesList,
  PageActions,
  FilterList
} from "./styles";
import { FaArrowLeft } from "react-icons/fa";

export default function Repositorio() {
  const { repositorio } = useParams();
  const [repoData, setRepoData] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterIndex, setFilterIndex] = useState(0);
  const [filters, setFilter] = useState([
    { state: "all", label: "Todas", active: true },
    { state: "open", label: "Abertas", active: false },
    { state: "closed", label: "Fechadas", active: false },
  ]);

  useEffect(() => {
    async function loadRepoAndIssues() {
      try {
        const nomeRepo = decodeURIComponent(repositorio);

        const [repositorioData, issuesData] = await Promise.all([
          api.get(`/repos/${nomeRepo}`),
          api.get(`/repos/${nomeRepo}/issues`, {
            params: {
              state: filters[filterIndex].state,
              per_page: 5,
            },
          }),
        ]);

        setRepoData(repositorioData.data);
        setIssues(issuesData.data);
      } catch (error) {
        console.error("Erro ao buscar dados do repositório:", error);
        alert("Erro ao buscar dados do repositório.");
      } finally {
        setLoading(false);
      }
    }

    loadRepoAndIssues();
  }, [repositorio]);

  useEffect(() => {
    async function loadIssues() {
      try {
        const nomeRepo = decodeURIComponent(repositorio);

        const response = await api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state: filters[filterIndex].state,
            page,
            per_page: 5,
          },
        });

        setIssues(response.data);
      } catch (error) {
        console.error("Erro ao carregar issues:", error);
        if (error.response?.status === 403) {
          alert(
            "Você atingiu o limite de requisições da API do GitHub. Tente novamente em alguns minutos."
          );
        }
      }
    }

    loadIssues();
  }, [repositorio, page, filterIndex]);

  function handleFilter(index) {
    setFilterIndex(index);
    setPage(1); // Reinicia a paginação ao mudar o filtro
  }

  function handlePage(action) {
    setPage((prevPage) => {
      if (action === "back" && prevPage > 1) return prevPage - 1;
      if (action === "next") return prevPage + 1;
      return prevPage;
    });
  }

  if (loading || !repoData.owner) {
    return (
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    );
  }

  return (
    <Container>
      <BackButton to="/">
        <FaArrowLeft color="#000" size={30} />
      </BackButton>

      <Owner>
        <img src={repoData.owner.avatar_url} alt={repoData.owner.login} />
        <h1>{repoData.name}</h1>
        <p>{repoData.description}</p>
      </Owner>

      <FilterList active={filterIndex}>
        {filters.map((filter, index) => (
          <button
            type="button"
            key={filter.state}
            onClick={() => handleFilter(index)}
          >
            {filter.label}
          </button>
        ))}
      </FilterList>

      <IssuesList>
        {issues.map((issue) => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />
            <div>
              <strong>
                <a href={issue.html_url} target="_blank" rel="noreferrer">
                  {issue.title}
                </a>
                {issue.labels.map((label) => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>
              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssuesList>

      <PageActions>
        <button
          type="button"
          onClick={() => handlePage("back")}
          disabled={page < 2}
        >
          Voltar
        </button>
        <button type="button" onClick={() => handlePage("next")}>
          Próxima
        </button>
      </PageActions>
    </Container>
  );
}