---
sidebar_position: 1
description: "Practica con 50 ejercicios de Query Methods de Spring Data JPA usando JpaRepository y métodos derivados por nombre."
---

# Ejercicios de JPA con Query Methods

 **Introducción breve y referencias**

En este post encontrarás 50 ejercicios que muestran distintas funcionalidades de los *Query Methods* con Spring Data JPA (métodos derivados por nombre) usando `JpaRepository`.  
Para la referencia oficial sobre la creación de queries a partir de nombres de métodos y la lista de palabras clave soportadas por Spring Data JPA, consulta la [documentación oficial de Spring Data JPA](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html).  

Fuentes recomendadas:
- [Spring Data JPA — JPA Query Methods (reference)](https://docs.spring.io/spring-data/jpa/reference/jpa.html)  
- [Spring Data JPA — Repository query keywords (lista de *keywords* soportadas)](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html)  
- [Baeldung — Spring Data JPA Query Methods](https://www.baeldung.com/spring-data-derived-queries)  


## Especificación de los modelos

A continuación se definen las entidades que se usarán como referencia en los ejercicios. Puedes copiarlas directamente en tu proyecto Spring Boot y rellenar sus métodos faltantes usando `Lombok`.

## Especificación del modelo a revisar

A continuación se definen las entidades Java (anotaciones JPA) que usaremos como referencia en los ejercicios.  

```java title="Especificación del modelo a revisar"
package com.example.demo.model;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.*;

@Entity
@Table(name = "departments")
public class Department {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    // getters / setters
}

@Entity
@Table(name = "instructors")
public class Instructor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private Timestamp hireDate;
    private boolean active;

    @ManyToOne
    private Department department;
    // getters / setters
}

@Entity
@Table(name = "courses")
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code; // e.g. CS101
    private String title;
    private int credits;
    private Timestamp startDate;
    private boolean active;

    @Enumerated(EnumType.STRING)
    private Level level; // BEGINNER / INTERMEDIATE / ADVANCED

    @ManyToOne
    private Department department;

    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();
    // getters / setters
}

@Entity
@Table(name = "students")
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Integer age;
    private Double gpa;
    private boolean active;
    private Timestamp registrationDate;

    private String city;
    private String state;

    @ManyToMany
    @JoinTable(name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id"))
    private Set<Course> courses = new HashSet<>();

    @ManyToOne
    private Instructor advisor;

    @OneToMany(mappedBy = "student")
    private List<Enrollment> enrollments = new ArrayList<>();
    // getters / setters
}

@Entity
@Table(name = "enrollments")
public class Enrollment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Student student;

    @ManyToOne
    private Course course;

    @Enumerated(EnumType.STRING)
    private Semester semester; // SPRING, FALL, etc.

    private Double grade;

    @Enumerated(EnumType.STRING)
    private EnrollmentStatus status; // ENROLLED, DROPPED, COMPLETED
    // getters / setters
}

public enum Level {
    BEGINNER, INTERMEDIATE, ADVANCED
}

public enum Semester {
    SPRING, SUMMER, FALL, WINTER
}

public enum EnrollmentStatus {
    ENROLLED, DROPPED, COMPLETED
}
```

> **Nota**: las entidades previas muestran los campos y relaciones básicos.

## Ejercicios de QueryMethods usando JpaRepository

A continuación vienen algunos ejercicios para practicar la creación de *query methods* usando `JpaRepository`. Cada ejercicio incluye:
- Un subtítulo con el nombre del *query method*.
- Una descripción de lo que se pide.
- Una sección `<details>` con la solución esperada: la firma del método en el `Repository` y un ejemplo de uso (servicio o test).


### `findByUsername`

**Qué se requiere:** Encuentra todos los estudiantes cuyo `username` sea igual a un string dado.

<details>
<summary>Solución esperada</summary>

```java title="findByUsername"
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByUsername(String username);
}
```

Ejemplo de uso:
```java title="findByUsername"
@Autowired
private StudentRepository repo;

public List<Student> findStudentsByUsername(String username) {
    return repo.findByUsername(username);
}
```

</details>


### `findByEmailIgnoreCase`

**Qué se requiere:** Busca estudiantes por email, ignorando mayúsculas/minúsculas.

<details>
<summary>Solución esperada</summary>

```java title="findByEmailIgnoreCase"
List<Student> findByEmailIgnoreCase(String email);
```

Uso:
```java title="findByEmailIgnoreCase"
List<Student> s = repo.findByEmailIgnoreCase("ALICE@EXAMPLE.COM");
// Encuentra registros aunque el email esté en distinta capitalización.
```

</details>


### `findByFirstNameAndLastName`

**Qué se requiere:** Busca estudiantes por `firstName` y `lastName`.

<details>
<summary>Solución esperada</summary>

```java title="findByFirstNameAndLastName"
List<Student> findByFirstNameAndLastName(String firstName, String lastName);
```

Uso:
```java title="findByFirstNameAndLastName"
repo.findByFirstNameAndLastName("Alice", "Lopez");
```

</details>


### `findByAgeGreaterThan`

**Qué se requiere:** Encuentra estudiantes con `age` mayor a un valor.

<details>
<summary>Solución esperada</summary>

```java title="findByAgeGreaterThan"
List<Student> findByAgeGreaterThan(Integer age);
```

Uso:
```java title="findByAgeGreaterThan"
repo.findByAgeGreaterThan(21);
```

</details>


### `findByAgeGreaterThanEqual`

**Qué se requiere:** Encuentra estudiantes con `age` mayor o igual a un valor.

<details>
<summary>Solución esperada</summary>

```java title="findByAgeGreaterThanEqual"
List<Student> findByAgeGreaterThanEqual(Integer age);
```

</details>


### `findByGpaBetween`

**Qué se requiere:** Encuentra estudiantes con `gpa` dentro de un rango (inclusive).

<details>
<summary>Solución esperada</summary>

```java title="findByGpaBetween"
List<Student> findByGpaBetween(Double min, Double max);
```

Uso:
```java title="findByGpaBetween"
repo.findByGpaBetween(3.0, 4.0);
```

</details>


### `findByActiveTrue`

**Qué se requiere:** Encuentra estudiantes activos (campo boolean `active` = true).

<details>
<summary>Solución esperada</summary>

```java title="findByActiveTrue"
List<Student> findByActiveTrue();
```

Uso:
```java title="findByActiveTrue"
repo.findByActiveTrue();
```

</details>


### `findByActiveFalse`

**Qué se requiere:** Encuentra estudiantes inactivos (campo boolean `active` = false).

<details>
<summary>Solución esperada</summary>

```java title="findByActiveFalse"
List<Student> findByActiveFalse();
```

</details>


### `findByRegistrationDateAfter`

**Qué se requiere:** Encuentra estudiantes que se registraron después de una fecha dada.

<details>
<summary>Solución esperada</summary>

```java title="findByRegistrationDateAfter"
List<Student> findByRegistrationDateAfter(Timestamp date);
```

Uso:
```java title="findByRegistrationDateAfter"
repo.findByRegistrationDateAfter(Timestamp.valueOf(LocalDateTime.of(2024, 1, 1, 0, 0)));
```

</details>


### `findByRegistrationDateBetween`

**Qué se requiere:** Encuentra estudiantes registrados entre dos fechas.

<details>
<summary>Solución esperada</summary>

```java title="findByRegistrationDateBetween"
List<Student> findByRegistrationDateBetween(Timestamp from, Timestamp to);
```

Uso:
```java title="findByRegistrationDateBetween"
repo.findByRegistrationDateBetween(Timestamp.valueOf(LocalDateTime.of(2024,1,1,0,0)), Timestamp.valueOf(LocalDateTime.of(2024,12,31,23,59)));
```

</details>

### `findByCoursesCode`

**Qué se requiere:** Encuentra estudiantes que estén inscritos en un curso con un código dado (join implicito con collection `courses`).

<details>
<summary>Solución esperada</summary>

```java title="findByCoursesCode"
List<Student> findByCoursesCode(String code);
```

Uso:
```java title="findByCoursesCode"
repo.findByCoursesCode("CS101");
```

</details>


### `findByCoursesTitleContainingIgnoreCase`

**Qué se requiere:** Busca estudiantes que tengan cursos cuyo título contenga una subcadena (case-insensitive).

<details>
<summary>Solución esperada</summary>

```java title="findByCoursesTitleContainingIgnoreCase"
List<Student> findByCoursesTitleContainingIgnoreCase(String titlePart);
```

Uso:
```java title="findByCoursesTitleContainingIgnoreCase"
repo.findByCoursesTitleContainingIgnoreCase("data");
```

</details>


### `findDistinctByCoursesCode`

**Qué se requiere:** Encuentra estudiantes distintos (sin duplicados) inscritos en el curso `code`.

<details>
<summary>Solución esperada</summary>

```java title="findDistinctByCoursesCode"
List<Student> findDistinctByCoursesCode(String code);
```

Uso:
```java title="findDistinctByCoursesCode"
repo.findDistinctByCoursesCode("CS101");
```

</details>


### `findByAdvisorLastName`

**Qué se requiere:** Encuentra estudiantes cuyo advisor (ManyToOne Instructor) tiene un apellido dado.

<details>
<summary>Solución esperada</summary>

```java title="findByAdvisorLastName"
List<Student> findByAdvisorLastName(String lastName);
```

Uso:
```java title="findByAdvisorLastName"
repo.findByAdvisorLastName("Gonzalez");
```

</details>


### `findByAdvisorId`

**Qué se requiere:** Encuentra estudiantes por el id del advisor.

<details>
<summary>Solución esperada</summary>

```java title="findByAdvisorId"
List<Student> findByAdvisorId(Long instructorId);
```

Uso:
```java title="findByAdvisorId"
repo.findByAdvisorId(42L);
```

</details>


### `findByAdvisorIsNull`

**Qué se requiere:** Encuentra estudiantes que no tienen advisor asignado.

<details>
<summary>Solución esperada</summary>

```java title="findByAdvisorIsNull"
List<Student> findByAdvisorIsNull();
```

Uso:
```java title="findByAdvisorIsNull"
repo.findByAdvisorIsNull();
```

</details>


### `existsByEmail`

**Qué se requiere:** Comprueba si existe un estudiante con un `email` dado.

<details>
<summary>Solución esperada</summary>

```java title="existsByEmail"
boolean existsByEmail(String email);
```

Uso:
```java title="existsByEmail"
boolean exists = repo.existsByEmail("alice@example.com");
```

</details>


### `countByActiveTrue`

**Qué se requiere:** Cuenta cuantos estudiantes están activos.

<details>
<summary>Solución esperada</summary>

```java title="countByActiveTrue"
long countByActiveTrue();
```

Uso:
```java title="countByActiveTrue"
long activeStudents = repo.countByActiveTrue();
```

</details>


### `deleteByUsername`

**Qué se requiere:** Borra estudiantes por `username` (método reservado: delete...).

<details>
<summary>Solución esperada</summary>

```java title="deleteByUsername"
void deleteByUsername(String username);
```

Uso:
```java title="deleteByUsername"
repo.deleteByUsername("old_user");
```

</details>


### `findTop5ByOrderByGpaDesc`

**Qué se requiere:** Devuelve los 5 estudiantes con mayor GPA (Top / OrderBy).

<details>
<summary>Solución esperada</summary>

```java title="findTop5ByOrderByGpaDesc"
List<Student> findTop5ByOrderByGpaDesc();
```

Uso:
```java title="findTop5ByOrderByGpaDesc"
List<Student> top5 = repo.findTop5ByOrderByGpaDesc();
```

</details>


### `findFirstByOrderByRegistrationDateAsc`

**Qué se requiere:** Encuentra el primer estudiante (el más antiguo) por fecha de registro.

<details>
<summary>Solución esperada</summary>

```java title="findFirstByOrderByRegistrationDateAsc"
Optional<Student> findFirstByOrderByRegistrationDateAsc();
```

Uso:
```java title="findFirstByOrderByRegistrationDateAsc"
Optional<Student> first = repo.findFirstByOrderByRegistrationDateAsc();
```

</details>


### `findByFirstNameStartingWith`

**Qué se requiere:** Busca estudiantes cuyo `firstName` empieza con un prefijo.

<details>
<summary>Solución esperada</summary>

```java title="findByFirstNameStartingWith"
List<Student> findByFirstNameStartingWith(String prefix);
```

Uso:
```java title="findByFirstNameStartingWith"
repo.findByFirstNameStartingWith("Al");
```

</details>


### `findByLastNameEndingWith`

**Qué se requiere:** Busca estudiantes cuyo `lastName` termina con un sufijo.

<details>
<summary>Solución esperada</summary>

```java title="findByLastNameEndingWith"
List<Student> findByLastNameEndingWith(String suffix);
```

Uso:
```java title="findByLastNameEndingWith"
repo.findByLastNameEndingWith("ez");
```

</details>


### `findByFirstNameContaining`

**Qué se requiere:** Busca estudiantes cuyo `firstName` contiene una subcadena.

<details>
<summary>Solución esperada</summary>

```java title="findByFirstNameContaining"
List<Student> findByFirstNameContaining(String fragment);
```

Uso:
```java title="findByFirstNameContaining"
repo.findByFirstNameContaining("li");
```

</details>


### `findByEmailLike`

**Qué se requiere:** Busca estudiantes con `email` usando LIKE (usa % para comodines).

<details>
<summary>Solución esperada</summary>

```java title="findByEmailLike"
List<Student> findByEmailLike(String pattern);
```

Uso:
```java title="findByEmailLike"
repo.findByEmailLike("%example.com");
```

</details>


### `findByGpaIsNull`

**Qué se requiere:** Encuentra estudiantes cuyo `gpa` es NULL.

<details>
<summary>Solución esperada</summary>

```java title="findByGpaIsNull"
List<Student> findByGpaIsNull();
```

</details>


### `findByGpaIsNotNull`

**Qué se requiere:** Encuentra estudiantes cuyo `gpa` no es NULL.

<details>
<summary>Solución esperada</summary>

```java title="findByGpaIsNotNull"
List<Student> findByGpaIsNotNull();
```

</details>


### `findByUsernameIn`

**Qué se requiere:** Encuentra estudiantes cuyo `username` está en una colección dada (IN).

<details>
<summary>Solución esperada</summary>

```java title="findByUsernameIn"
List<Student> findByUsernameIn(Collection<String> usernames);
```

Uso:
```java title="findByUsernameIn"
repo.findByUsernameIn(List.of("a","b","c"));
```

</details>


### `findByUsernameNotIn`

**Qué se requiere:** Encuentra estudiantes cuyo `username` NO está en una colección dada (NOT IN).

<details>
<summary>Solución esperada</summary>

```java title="findByUsernameNotIn"
List<Student> findByUsernameNotIn(Collection<String> usernames);
```

</details>


### `findByUsernameNot`

**Qué se requiere:** Encuentra estudiantes cuyo `username` NO sea el dado (NOT).

<details>
<summary>Solución esperada</summary>

```java title="findByUsernameNot"
List<Student> findByUsernameNot(String username);
```

</details>


### `findByDepartmentName (CourseRepository)`

**Qué se requiere:** En CourseRepository: busca cursos por el nombre del department asociado.

<details>
<summary>Solución esperada</summary>

```java title="findByDepartmentName (CourseRepository)"
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByDepartmentName(String deptName);
}
```

Uso:
```java title="findByDepartmentName (CourseRepository)"
courseRepo.findByDepartmentName("Computer Science");
```

</details>


### `findByCreditsLessThan (CourseRepository)`

**Qué se requiere:** Encuentra cursos con menos de N créditos.

<details>
<summary>Solución esperada</summary>

```java title="findByCreditsLessThan (CourseRepository)"
List<Course> findByCreditsLessThan(int credits);
```

Uso:
```java title="findByCreditsLessThan (CourseRepository)"
courseRepo.findByCreditsLessThan(4);
```

</details>


### `findByLevelIn (CourseRepository)`

**Qué se requiere:** Encuentra cursos cuyo `level` está dentro de una colección de niveles.

<details>
<summary>Solución esperada</summary>

```java title="findByLevelIn (CourseRepository)"
List<Course> findByLevelIn(Collection<Level> levels);
```

Uso:
```java title="findByLevelIn (CourseRepository)"
courseRepo.findByLevelIn(List.of(Level.BEGINNER, Level.INTERMEDIATE));
```

</details>


### `findByEnrollmentsGradeGreaterThan`

**Qué se requiere:** Encuentra estudiantes que tengan alguna inscripción (`enrollments`) con nota mayor a X.

<details>
<summary>Solución esperada</summary>

```java title="findByEnrollmentsGradeGreaterThan"
List<Student> findByEnrollmentsGradeGreaterThan(Double grade);
```

Uso:
```java title="findByEnrollmentsGradeGreaterThan"
repo.findByEnrollmentsGradeGreaterThan(85.0);
```

</details>


### `findByEnrollmentsStatus`

**Qué se requiere:** Encuentra estudiantes según el estado de alguna de sus inscripciones.

<details>
<summary>Solución esperada</summary>

```java title="findByEnrollmentsStatus"
List<Student> findByEnrollmentsStatus(EnrollmentStatus status);
```

Uso:
```java title="findByEnrollmentsStatus"
repo.findByEnrollmentsStatus(EnrollmentStatus.COMPLETED);
```

</details>


### `findByEnrollmentsSemesterAndCourseCode`

**Qué se requiere:** Encuentra estudiantes inscritos en un curso específico durante un semestre concreto.

<details>
<summary>Solución esperada</summary>

```java title="findByEnrollmentsSemesterAndCourseCode"
List<Student> findByEnrollmentsSemesterAndEnrollmentsCourseCode(Semester semester, String courseCode);
```

Uso:
```java title="findByEnrollmentsSemesterAndCourseCode"
repo.findByEnrollmentsSemesterAndEnrollmentsCourseCode(Semester.FALL, "CS101");
```

</details>


### `findByCoursesLevelAndCreditsGreaterThan`

**Qué se requiere:** Encuentra estudiantes que tienen al menos un curso con un `level` y más de N créditos.

<details>
<summary>Solución esperada</summary>

```java title="findByCoursesLevelAndCreditsGreaterThan"
List<Student> findByCoursesLevelAndCoursesCreditsGreaterThan(Level level, int credits);
```

Uso:
```java title="findByCoursesLevelAndCreditsGreaterThan"
repo.findByCoursesLevelAndCoursesCreditsGreaterThan(Level.ADVANCED, 3);
```

</details>


### `findByActiveTrue (paginated)`

**Qué se requiere:** Paginación: devuelve estudiantes activos con `Pageable`.

<details>
<summary>Solución esperada</summary>

```java title="findByActiveTrue (paginated)"
Page<Student> findByActiveTrue(Pageable pageable);
```

Uso:
```java title="findByActiveTrue (paginated)"
Page<Student> page = repo.findByActiveTrue(PageRequest.of(0, 20, Sort.by("gpa").descending()));
```

</details>


### `findByCoursesStartDateBefore`

**Qué se requiere:** Encuentra estudiantes que tienen cursos cuyo `startDate` es anterior a una fecha.

<details>
<summary>Solución esperada</summary>

```java title="findByCoursesStartDateBefore"
List<Student> findByCoursesStartDateBefore(Timestamp date);
```

Uso:
```java title="findByCoursesStartDateBefore"
repo.findByCoursesStartDateBefore(Timestamp.valueOf(LocalDateTime.now()));
```

</details>


### `findByFirstNameIgnoreCaseAndLastNameIgnoreCase`

**Qué se requiere:** Busca comparando `firstName` y `lastName` ignorando mayúsculas/minúsculas.

<details>
<summary>Solución esperada</summary>

```java title="Ejemplo en Java"
List<Student> findByFirstNameIgnoreCaseAndLastNameIgnoreCase(String first, String last);
```

</details>


### `findDistinctByFirstNameAndLastName`

**Qué se requiere:** Devuelve resultados distintos al filtrar por nombre y apellido.

<details>
<summary>Solución esperada</summary>

```java title="findDistinctByFirstNameAndLastName"
List<Student> findDistinctByFirstNameAndLastName(String first, String last);
```

</details>


### `findByEmailEndingWith`

**Qué se requiere:** Busca estudiantes cuyo email termina con una cadena dada.

<details>
<summary>Solución esperada</summary>

```java title="findByEmailEndingWith"
List<Student> findByEmailEndingWith(String suffix);
// Ej: findByEmailEndingWith("@gmail.com")
```

</details>


### `findByFirstNameOrderByLastNameAsc`

**Qué se requiere:** Ordena: devuelve estudiantes con un `firstName` dado ordenados por `lastName` ascendente.

<details>
<summary>Solución esperada</summary>

```java title="findByFirstNameOrderByLastNameAsc"
List<Student> findByFirstNameOrderByLastNameAsc(String firstName);
```

</details>


### `findByLastNameOrderByFirstNameDesc`

**Qué se requiere:** Ordena por `firstName` descendente.

<details>
<summary>Solución esperada</summary>

```java title="findByLastNameOrderByFirstNameDesc"
List<Student> findByLastNameOrderByFirstNameDesc(String lastName);
```

</details>


### `findByCoursesCodeOrderByCreditsDesc`

**Qué se requiere:** Busca estudiantes por código de curso y ordena por créditos (desc).

<details>
<summary>Solución esperada</summary>

```java title="findByCoursesCodeOrderByCreditsDesc"
List<Student> findByCoursesCodeOrderByCoursesCreditsDesc(String courseCode);
```

Uso:
```java title="findByCoursesCodeOrderByCreditsDesc"
repo.findByCoursesCodeOrderByCoursesCreditsDesc("CS101");
```

</details>


### `streamByActiveTrue`

**Qué se requiere:** Devuelve un `Stream` de estudiantes activos (útil para procesar grandes resultados).

<details>
<summary>Solución esperada</summary>

```java title="streamByActiveTrue"
Stream<Student> streamByActiveTrue();
```

Uso (recordar cerrar el stream si es necesario):
```java title="streamByActiveTrue"
try (Stream<Student> s = repo.streamByActiveTrue()) {
    s.forEach(...);
}
```

</details>


### `findTopByOrderByGpaAsc`

**Qué se requiere:** Devuelve el estudiante con menor GPA.

<details>
<summary>Solución esperada</summary>

```java title="findTopByOrderByGpaAsc"
Optional<Student> findTopByOrderByGpaAsc();
```

Uso:
```java title="findTopByOrderByGpaAsc"
Optional<Student> worst = repo.findTopByOrderByGpaAsc();
```

</details>


### `findByRegistrationDateYear (ejemplo con Between)`

**Qué se requiere:** Busca estudiantes registrados en un año determinado usando Between en fechas.

<details>
<summary>Solución esperada</summary>

```java title="Ejemplo en Java"
List<Student> findByRegistrationDateBetween(Timestamp startOfYear, Timestamp endOfYear);
// Ejemplo de llamada:
// repo.findByRegistrationDateBetween(Timestamp.valueOf(LocalDateTime.of(2024,1,1,0,0)), Timestamp.valueOf(LocalDateTime.of(2024,12,31,23,59)));
```

</details>


### `findByFirstNameNot`

**Qué se requiere:** Encuentra estudiantes cuyo `firstName` no sea el dado.

<details>
<summary>Solución esperada</summary>

```java title="findByFirstNameNot"
List<Student> findByFirstNameNot(String name);
```

</details>


### `findByEmailContainingIgnoreCaseAndActiveTrue`

**Qué se requiere:** Combinación compleja: email contiene X (ignoring case) y active = true.

<details>
<summary>Solución esperada</summary>

```java title="Ejemplo en Java"
List<Student> findByEmailContainingIgnoreCaseAndActiveTrue(String fragment);
```

Uso:
```java title="Ejemplo en Java"
repo.findByEmailContainingIgnoreCaseAndActiveTrue("example");
```

</details>


### `findDistinctByCoursesDepartmentName`

**Qué se requiere:** Devuelve estudiantes distintos que estén en cursos de un depto con nombre dado.

<details>
<summary>Solución esperada</summary>

```java title="findDistinctByCoursesDepartmentName"
List<Student> findDistinctByCoursesDepartmentName(String deptName);
```

Uso:
```java title="findDistinctByCoursesDepartmentName"
repo.findDistinctByCoursesDepartmentName("Mathematics");
```

</details>


### `findByEnrollmentsCourseCodeAndEnrollmentsStatus`

**Qué se requiere:** Encuentra estudiantes por código de curso y estado de la inscripción.

<details>
<summary>Solución esperada</summary>

```java title="Ejemplo en Java"
List<Student> findByEnrollmentsCourseCodeAndEnrollmentsStatus(String courseCode, EnrollmentStatus status);
```

Uso:
```java title="Ejemplo en Java"
repo.findByEnrollmentsCourseCodeAndEnrollmentsStatus("CS101", EnrollmentStatus.ENROLLED);
```

</details>


### `existsByUsername`

**Qué se requiere:** Comprueba existencia por `username`.

<details>
<summary>Solución esperada</summary>

```java title="existsByUsername"
boolean existsByUsername(String username);
```

Uso:
```java title="existsByUsername"
boolean e = repo.existsByUsername("kevin");
```

</details>


### `deleteAllByActiveFalse`

**Qué se requiere:** Borra todos los estudiantes inactivos (método reservado deleteAllBy...).

<details>
<summary>Solución esperada</summary>

```java title="deleteAllByActiveFalse"
void deleteAllByActiveFalse();
```

Uso:
```java title="deleteAllByActiveFalse"
repo.deleteAllByActiveFalse();
```

</details>


### `findByFirstNameOrLastName`

**Qué se requiere:** Busca estudiantes cuyo `firstName` O `lastName` coincida con los parámetros.

<details>
<summary>Solución esperada</summary>

```java title="findByFirstNameOrLastName"
List<Student> findByFirstNameOrLastName(String first, String last);
```

Uso:
```java title="findByFirstNameOrLastName"
repo.findByFirstNameOrLastName("Carlos","Gomez");
```

</details>


### `findByFirstNameNotContaining`

**Qué se requiere:** Encuentra estudiantes cuyo `firstName` NO contenga una subcadena.

<details>
<summary>Solución esperada</summary>

```java title="findByFirstNameNotContaining"
List<Student> findByFirstNameNotContaining(String fragment);
```

Uso:
```java title="findByFirstNameNotContaining"
repo.findByFirstNameNotContaining("test");
```

</details>



## Notas finales

- Muchas de las palabras clave soportadas por Spring Data JPA (por ejemplo `And`, `Or`, `Between`, `LessThan`, `GreaterThan`, `Like`, `OrderBy`, `Distinct`, `Top`, `First`, `IgnoreCase`, `IsNull`, `IsNotNull`, etc.) permiten expresar condiciones potentes sin necesidad de escribir JPQL explícito.
- Cuando la expresión derivada se vuelva muy compleja (muchos joins, subselects, condiciones dinámicas), considera usar `@Query` con JPQL/SQL, QueryDSL o Specification/Criteria API.  
- Para opciones de paginación y ordenamiento es preferible usar `Pageable` y `Sort` desde los parámetros de método en lugar de crear métodos con `OrderBy` muy largos.
