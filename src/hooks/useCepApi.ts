export const useCepApi = () => {
  const fetchAddressByCep = async (cep: string) => {
    const cleanedCep = cep.replace(/\D/g, "");
    const response = await fetch(
      `https://viacep.com.br/ws/${cleanedCep}/json/`
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar o endereço pelo CEP");
    }
    const data = await response.json();
    if (data.erro) {
      throw new Error("CEP não encontrado");
    }
    return {
      logradouro: data.logradouro,
      bairro: data.bairro,
      localidade: data.localidade,
      uf: data.uf,
    };
  };

  return { fetchAddressByCep };
};
