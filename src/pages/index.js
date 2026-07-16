import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={styles.heroBanner}>
            <div className="container">
                <Heading as="h1" className={styles.heroTitle}>
                    {siteConfig.title}
                </Heading>
                <p className={styles.heroSubtitle}>
                    Espacio para la documentación de proyectos, laboratorios y temas de interés académico desarrollados en la Universidad Icesi.
                </p>
                <div className={styles.buttons}>
                    <Link
                        className={clsx('button button--lg', styles.primaryButton)}
                        to="/docs/intro">
                        Comenzar Lectura
                    </Link>
                    <a
                        className={clsx('button button--lg', styles.secondaryButton)}
                        href="https://github.com/Kelocoes/docukelo-icesi.git"
                        target="_blank"
                        rel="noopener noreferrer">
                        Ver GitHub
                    </a>
                </div>
            </div>
        </header>
    );
}

export default function Home() {
    return (
        <Layout
            title="Inicio"
            description="Documentación de proyectos y asignaturas de la Universidad Icesi">
            <HomepageHeader />
            <main className={styles.mainSection}>
                <div className="container">
                    <Heading as="h2" className={styles.sectionTitle}>
                        Asignaturas y Contenidos
                    </Heading>
                    <div className={styles.cardGrid}>
                        <Link to="/docs/computacion-3/intro" className={styles.courseCard}>
                            <div className={styles.cardTitle}>Computación en Internet 3</div>
                            <p className={styles.cardDescription}>
                                Guías de aprendizaje paso a paso enfocadas en configuración de Docker, automatización de compilaciones, contenedores y despliegues en la nube.
                            </p>
                            <div className={styles.cardFooter}>
                                Explorar guías paso a paso &rarr;
                            </div>
                        </Link>

                        <Link to="/docs/disenando-con-algoritmos/intro" className={styles.courseCard}>
                            <div className={styles.cardTitle}>Diseñando con Algoritmos</div>
                            <p className={styles.cardDescription}>
                                Documentación de diseño de interfaces (UI/UX), interacción digital y maquetación avanzada utilizando clases de utilidad de Tailwind CSS.
                            </p>
                            <div className={styles.cardFooter}>
                                Explorar diseño y UI &rarr;
                            </div>
                        </Link>

                        <Link to="/docs/computacion-2/intro" className={styles.courseCard}>
                            <div className={styles.cardTitle}>Computación en Internet 2</div>
                            <p className={styles.cardDescription}>
                                Fundamentos de desarrollo de software web fullstack, incluyendo arquitecturas backend robustas, bases de datos y desarrollo de clientes web.
                            </p>
                            <div className={styles.cardFooter}>
                                Ver contenido base &rarr;
                            </div>
                        </Link>

                        <Link to="/docs/desarrollo-entornos-digitales-web/intro" className={styles.courseCard}>
                            <div className={styles.cardTitle}>Desarrollo de Entornos Digitales Web</div>
                            <p className={styles.cardDescription}>
                                Contenido práctico y teórico enfocado en la construcción de interfaces interactivas, desarrollo web moderno frontend y mejores prácticas de experiencia de usuario.
                            </p>
                            <div className={styles.cardFooter}>
                                Explorar entornos web &rarr;
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
        </Layout>
    );
}
