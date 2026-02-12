import { Link } from "react-router-dom";
import { APP_CONFIG } from "@/config/app";

export default function TermsAndPrivacy() {
  return (
    <>
      <div className="app-header__title calangar-font">
        <img src="/images/calangar.png" alt="Calangar Logo" width={100} />
      </div>
      <div style={{ maxWidth: 800, margin: "2rem auto", padding: "2rem" }}>
        <Link to="/" className="link-default">
          Voltar para o {APP_CONFIG.appName}
        </Link>

        <h1>Termos de Uso</h1>
        <p>
          Ao utilizar este site, você concorda com os seguintes termos de uso. O
          acesso e uso dos serviços estão sujeitos à aceitação e cumprimento
          destes termos. Reservamo-nos o direito de alterar estes termos a
          qualquer momento, com notificação prévia aos usuários.
        </p>

        <h2>1. Aceitação dos Termos</h2>
        <p>
          Ao acessar e usar {APP_CONFIG.appName}, você aceita estar vinculado a
          estes Termos de Uso e à Política de Privacidade. Se não concordar com
          algum termo, você não poderá acessar ou usar o serviço.
        </p>

        <h2>2. Uso Aceitável</h2>
        <ul>
          <li>Você é responsável por fornecer informações verdadeiras e atualizadas.</li>
          <li>Você concorda em não utilizar o sistema para fins ilícitos ou prejudiciais.</li>
          <li>
            É proibido transmitir conteúdo que seja ofensivo, discriminatório,
            ilegal ou que viole direitos de terceiros.
          </li>
          <li>
            Você não pode tentar acessar, alterar ou deletar informações de
            outros usuários sem autorização.
          </li>
        </ul>

        <h2>3. Autenticação e Segurança de Conta</h2>
        <ul>
          <li>
            Você é responsável por manter a confidencialidade de suas credenciais
            de login.
          </li>
          <li>
            Você é responsável por todas as atividades realizadas em sua conta.
          </li>
          <li>
            Notifique-nos imediatamente se suspeitar de uso não autorizado de
            sua conta.
          </li>
        </ul>

        <h2>4. Consequências do Uso Indevido</h2>
        <p>
          O uso indevido da plataforma pode resultar em suspensão ou exclusão
          permanente da conta, sem reembolso. Podemos cooperar com autoridades
          legais quando necessário.
        </p>

        <h2>5. Modificações do Serviço</h2>
        <p>
          Reservamo-nos o direito de modificar ou descontinuar o serviço a
          qualquer momento, com ou sem notificação prévia.
        </p>

        <h2>6. Limitação de Responsabilidade</h2>
        <p>
          O serviço é fornecido "como está" sem garantias de qualquer tipo. Não
          nos responsabilizamos por danos indiretos, incidentais, especiais ou
          consequentes resultantes do uso ou incapacidade de uso do serviço.
        </p>

        <hr style={{ margin: "2rem 0" }} />

        <h1>Política de Privacidade</h1>
        <p>
          Sua privacidade é primordial para nós. Esta política explica como
          coletamos, usamos, protegemos e compartilhamos suas informações
          pessoais quando você usa {APP_CONFIG.appName}.
        </p>

        <h2>1. Informações que Coletamos</h2>
        <p>Coletamos informações de várias formas:</p>
        <ul>
          <li>
            <strong>Autenticação com Google OAuth:</strong> Quando você se
            autentica via Google, coletamos seu nome, endereço de e-mail,
            identificador único do Google e foto de perfil (se disponível).
          </li>
          <li>
            <strong>Informações de Cadastro:</strong> Dados adicionais que você
            pode fornecer como endereço, telefone e empresa.
          </li>
          <li>
            <strong>Dados de Uso:</strong> Informações sobre como você interage
            com a plataforma, incluindo endereço IP, tipo de navegador, páginas
            visitadas e horário de acesso.
          </li>
          <li>
            <strong>Cookies e Tecnologias Similares:</strong> Utilizamos cookies,
            armazenamento local e tecnologias similares para aprimorar sua
            experiência.
          </li>
        </ul>

        <h2>2. Como Usamos Suas Informações</h2>
        <p>Utilizamos suas informações para:</p>
        <ul>
          <li>Autenticar e gerenciar sua conta;</li>
          <li>Fornecer e melhorar os serviços oferecidos;</li>
          <li>Comunicar sobre sua conta e fazer alterações;</li>
          <li>Enviar notificações e atualizações importantes;</li>
          <li>Analisar e melhorar a segurança e performance;</li>
          <li>Conformidade com obrigações legais;</li>
          <li>
            Contato para suporte, pesquisa e feedback (apenas quando você se
            ofereceu);
          </li>
        </ul>

        <h2>3. Compartilhamento de Dados</h2>
        <p>
          <strong>Google OAuth:</strong> Você nos autoriza a receber
          informações da Google como parte do processo de autenticação OAuth 2.0.
          Você pode revogar essa autorização a qualquer momento através das
          configurações de segurança da sua conta Google em{" "}
          <a href="https://myaccount.google.com/" target="_blank" rel="noopener noreferrer">
            myaccount.google.com
          </a>
          .
        </p>
        <p>
          <strong>Terceiros:</strong> Não vendemos ou compartilhamos seus dados
          pessoais com terceiros para fins de marketing. Podemos compartilhar
          dados com:
        </p>
        <ul>
          <li>Provedores de serviços que nos ajudam a operar a plataforma;</li>
          <li>
            Autoridades legais quando exigido por lei ou ordem judicial;
          </li>
          <li>
            Em caso de fusão, aquisição ou insolvência (com notificação prévia);
          </li>
        </ul>

        <h2>4. Segurança dos Dados</h2>
        <p>
          Implementamos medidas de segurança técnicas, administrativas e físicas
          para proteger suas informações pessoais contra acesso não autorizado,
          alteração, destruição ou divulgação. Isso inclui:
        </p>
        <ul>
          <li>Criptografia de dados em trânsito (HTTPS);</li>
          <li>Senhas são criptografadas usando algoritmos modernos;</li>
          <li>Acesso restrito aos dados pessoais por nossa equipe;</li>
          <li>Auditorias de segurança regulares;</li>
        </ul>
        <p>
          Porém, nenhum método de transmissão pela internet é 100% seguro.
          Não podemos garantir segurança absoluta.
        </p>

        <h2>5. Retenção de Dados</h2>
        <p>
          Mantemos seus dados pessoais pelo tempo necessário para fornecer os
          serviços e cumprir obrigações legais. Você pode solicitar a exclusão
          de seus dados a qualquer momento, sujeito às obrigações legais que nos
          obriguem a reter certas informações.
        </p>

        <h2>6. Seus Direitos</h2>
        <p>Você tem direito a:</p>
        <ul>
          <li>
            <strong>Acesso:</strong> Solicitar cópia de seus dados pessoais;
          </li>
          <li>
            <strong>Correção:</strong> Corrigir dados incorretos ou incompletos;
          </li>
          <li>
            <strong>Exclusão:</strong> Solicitar a exclusão de seus dados (direito
            ao esquecimento);
          </li>
          <li>
            <strong>Portabilidade:</strong> Receber seus dados em formato
            estruturado e transferi-los;
          </li>
          <li>
            <strong>Oposição:</strong> Opor-se ao processamento de seus dados em
            certas circunstâncias;
          </li>
          <li>
            <strong>Revogação de Consentimento:</strong> Revogar o consentimento
            a qualquer momento sem afetar processamentos anteriores;
          </li>
        </ul>

        <h2>7. Cookies e Tecnologias de Rastreamento</h2>
        <p>
          Utilizamos cookies para autenticação, preferências do usuário e
          análise de uso. Você pode controlar as configurações de cookies em
          seu navegador, mas isso pode afetar a funcionalidade do serviço.
        </p>

        <h2>8. Conformidade com LGPD/GDPR</h2>
        <p>
          {APP_CONFIG.appName} cumpre as regulamentações de proteção de dados
          aplicáveis, incluindo a Lei Geral de Proteção de Dados (LGPD) no
          Brasil e o Regulamento Geral de Proteção de Dados (GDPR) na Europa.
        </p>

        <h2>9. Menores de Idade</h2>
        <p>
          Nossa plataforma não é destinada a menores de 18 anos. Não coletamos
          intencionalmente informações de menores de idade. Se descobrirmos que
          coletamos dados de um menor sem consentimento dos pais/responsáveis,
          deletaremos imediatamente.
        </p>

        <h2>10. Alterações nesta Política</h2>
        <p>
          Podemos atualizar esta Política de Privacidade periodicamente. Quando
          fazemos mudanças significativas, notificamos você por e-mail ou
          destaque na plataforma. Seu uso contínuo da plataforma significa
          aceitação das alterações.
        </p>

        <h2>11. Contato</h2>
        <p>
          Se você tiver dúvidas sobre estes Termos de Uso ou Política de
          Privacidade, ou deseje exercer seus direitos, entre em contato conosco
          através dos canais de suporte fornecidos no site.
        </p>

        <p style={{ marginTop: "2rem", marginBottom: "0", fontSize: "0.9em" }}>
          <strong>Última atualização:</strong> 12 de fevereiro de 2026
        </p>
      </div>
    </>
  );
}
