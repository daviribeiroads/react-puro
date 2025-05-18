import React, { useState, useCallback } from "react";
import { FaGithub, FaPlus, FaSpinner } from "react-icons/fa";
import { Container, Form, SubmitButton } from "./styles";
import api from "../../services/api";

export default function Main() {
  const [newRepo, setNewRepo] = useState("");
  const [repositorios, setRepositorios] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      async function submit() {
        setLoading(true);
        try {
          const response = await api.get(`repos/${newRepo}`);

          const data = {
            name: response.data.full_name,
          };

          setRepositorios([...repositorios, data]);
          setNewRepo("");
        } catch (error) {
          if (error.response && error.response.status === 404) {
            alert(
              "Repositório não encontrado. Verifique se o endereço está correto (ex: usuario/repositorio)"
            );
          } else {
            alert("Erro ao buscar repositório. Tente novamente mais tarde.");
            console.error(error); // opcional: útil só para devs
          }
        } finally {
          setLoading(false);
        }
      }

      submit();
    },
    [newRepo, repositorios]
  );

  function handleinputChange(e) {
    setNewRepo(e.target.value);
  }

  return (
    <Container>
      <h1>
        <FaGithub size={25} />
        Meus Repositorio
      </h1>

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Adicionar Repositorios"
          value={newRepo}
          onChange={handleinputChange}
        />

        <SubmitButton loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color="#FFF" size={14} />
          ) : (
            <FaPlus color="#FFF" size={14} />
          )}
        </SubmitButton>
      </Form>
    </Container>
  );
}
