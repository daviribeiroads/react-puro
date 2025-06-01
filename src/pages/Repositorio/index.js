import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { Container } from "./styles";

export default function Repositorio() {
  const { repositorio } = useParams(); // pegando o parâmetro da URL corretamente
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
}