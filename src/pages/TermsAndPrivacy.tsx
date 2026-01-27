import { Link } from "react-router-dom";

export default function TermsAndPrivacy() {
  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "2rem" }}>
      <Link to="/" className="link-default">
        Voltar para o login
      </Link>
      <h1>Termos de Uso</h1>
      <p>
        Ao utilizar este site, você concorda com os seguintes termos de uso. O
        acesso e uso dos serviços estão sujeitos à aceitação e cumprimento
        destes termos. Reservamo-nos o direito de alterar estes termos a
        qualquer momento, sem aviso prévio.
      </p>
      <ul>
        <li>Você deve fornecer informações verdadeiras e atualizadas.</li>
        <li>Não é permitido utilizar o sistema para fins ilícitos.</li>
        <li>
          O uso indevido da plataforma pode resultar em suspensão ou exclusão da
          conta.
        </li>
      </ul>

      <h1>Política de Privacidade</h1>
      <p>
        Sua privacidade é importante para nós. Coletamos apenas as informações
        necessárias para o funcionamento do serviço e não compartilhamos seus
        dados pessoais com terceiros sem sua autorização, exceto quando exigido
        por lei.
      </p>
      <ul>
        <li>Seus dados são armazenados de forma segura.</li>
        <li>
          Você pode solicitar a exclusão dos seus dados a qualquer momento.
        </li>
        <li>
          Utilizamos cookies apenas para melhorar sua experiência de navegação.
        </li>
      </ul>

      <p>
        Para dúvidas, entre em contato pelo e-mail de suporte informado no site.
      </p>
    </div>
  );
}
