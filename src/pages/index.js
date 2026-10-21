import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CourseCards from '@site/src/components/CourseCards';
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
                    <CourseCards />
                </div>
            </main>
        </Layout>
    );
}
