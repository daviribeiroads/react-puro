import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { Container, Owner, Loading, BackButton } from "./styles";
import { FaArrowLeft } from 'react-icons/fa';

export default function Repositorio() {
  const { repositorio } = useParams();
  const [repoData, setRepoData] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const nomeRepo = decodeURIComponent(repositorio);

        const [repositorioData, issuesData] = await Promise.all([
          api.get(`/repos/${nomeRepo}`),
          api.get(`/repos/${nomeRepo}/issues`, {
            params: {
              state: "open",
              per_page: 5,
            },
          }),
        ]);

        setRepoData(repositorioData.data);
        setIssues(issuesData.data);
      } catch (error) {
        console.error("Erro ao buscar dados do repositório:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [repositorio]);

  if (loading || !repoData.owner) {
    return (
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    );
  }

  return (
    <Container>

      <BackButton>
          <FaArrowLeft color="#000" size={30} />
      </BackButton>

      <Owner>
        <img src={repoData.owner.avatar_url} alt={repoData.owner.login} />
        <h1>{repoData.name}</h1>
        <p>{repoData.description}</p>
      </Owner>
    </Container>
  );
}