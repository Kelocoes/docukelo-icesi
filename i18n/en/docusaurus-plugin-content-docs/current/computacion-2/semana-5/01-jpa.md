---
sidebar_position: 1
description: "Practice with 50 Spring Data JPA Query Methods exercises using JpaRepository and name-derived methods."
---

# JPA Exercises with Query Methods

 **Brief Introduction and References**

In this guide, you will find 50 exercises demonstrating various features of *Query Methods* with Spring Data JPA (derived method names) using `JpaRepository`.  
For the official reference on creating queries from method names and the list of keywords supported by Spring Data JPA, check the [official Spring Data JPA documentation](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html).  

Recommended resources:
- [Spring Data JPA — JPA Query Methods (reference)](https://docs.spring.io/spring-data/jpa/reference/jpa.html)  
- [Spring Data JPA — Repository query keywords (list of supported keywords)](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html)  
- [Baeldung — Spring Data JPA Query Methods](https://www.baeldung.com/spring-data-derived-queries)  


## Domain Model Specification

Below are the entities used as reference across the exercises. You can copy them directly into your Spring Boot project and generate accessors using `Lombok`.

## Relational Entities Specification

Below are the Java entity definitions (JPA annotations) used across the exercises.  

```java title="Relational Entities Specification"
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

> **Note**: The entities above illustrate the basic fields and relational mappings.

## Query Method Exercises Using JpaRepository

Below are practical exercises to practice creating *query methods* using `JpaRepository`. Each exercise includes:
- A heading with the query method name.
- A description of the requirement.
- A `<details>` block with the expected solution: the method signature in the `Repository` and an example of usage (service or test).


### `findByUsername`

**Requirement:** Find all students whose `username` matches a given string.

<details>
<summary>Expected solution</summary>

```java title="findByUsername"
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByUsername(String username);
}
```

Usage example:
```java title="findByUsername (2)"
@Autowired
private StudentRepository repo;

public List<Student> findStudentsByUsername(String username) {
    return repo.findByUsername(username);
}
```

</details>


### `findByEmailIgnoreCase`

**Requirement:** Search for students by email, ignoring case.

<details>
<summary>Expected solution</summary>

```java title="findByEmailIgnoreCase"
List<Student> findByEmailIgnoreCase(String email);
```

Usage:
```java title="findByEmailIgnoreCase (2)"
List<Student> s = repo.findByEmailIgnoreCase("ALICE@EXAMPLE.COM");
// Finds records even if the email has different casing.
```

</details>


### `findByFirstNameAndLastName`

**Requirement:** Search for students by `firstName` and `lastName`.

<details>
<summary>Expected solution</summary>

```java title="findByFirstNameAndLastName"
List<Student> findByFirstNameAndLastName(String firstName, String lastName);
```

Usage:
```java title="findByFirstNameAndLastName (2)"
repo.findByFirstNameAndLastName("Alice", "Lopez");
```

</details>


### `findByAgeGreaterThan`

**Requirement:** Find students with `age` greater than a value.

<details>
<summary>Expected solution</summary>

```java title="findByAgeGreaterThan"
List<Student> findByAgeGreaterThan(Integer age);
```

Usage:
```java title="findByAgeGreaterThan (2)"
repo.findByAgeGreaterThan(21);
```

</details>


### `findByAgeGreaterThanEqual`

**Requirement:** Find students with `age` greater than or equal to a value.

<details>
<summary>Expected solution</summary>

```java title="findByAgeGreaterThanEqual"
List<Student> findByAgeGreaterThanEqual(Integer age);
```

</details>


### `findByGpaBetween`

**Requirement:** Find students with `gpa` within a given range (inclusive).

<details>
<summary>Expected solution</summary>

```java title="findByGpaBetween"
List<Student> findByGpaBetween(Double min, Double max);
```

Usage:
```java title="findByGpaBetween (2)"
repo.findByGpaBetween(3.0, 4.0);
```

</details>


### `findByActiveTrue`

**Requirement:** Find active students (boolean field `active` = true).

<details>
<summary>Expected solution</summary>

```java title="findByActiveTrue"
List<Student> findByActiveTrue();
```

Usage:
```java title="findByActiveTrue (2)"
repo.findByActiveTrue();
```

</details>


### `findByActiveFalse`

**Requirement:** Find inactive students (boolean field `active` = false).

<details>
<summary>Expected solution</summary>

```java title="findByActiveFalse"
List<Student> findByActiveFalse();
```

</details>


### `findByRegistrationDateAfter`

**Requirement:** Find students who registered after a given date.

<details>
<summary>Expected solution</summary>

```java title="findByRegistrationDateAfter"
List<Student> findByRegistrationDateAfter(Timestamp date);
```

Usage:
```java title="findByRegistrationDateAfter (2)"
repo.findByRegistrationDateAfter(Timestamp.valueOf(LocalDateTime.of(2024, 1, 1, 0, 0)));
```

</details>


### `findByRegistrationDateBetween`

**Requirement:** Find students registered between two dates.

<details>
<summary>Expected solution</summary>

```java title="findByRegistrationDateBetween"
List<Student> findByRegistrationDateBetween(Timestamp from, Timestamp to);
```

Usage:
```java title="findByRegistrationDateBetween (2)"
repo.findByRegistrationDateBetween(Timestamp.valueOf(LocalDateTime.of(2024,1,1,0,0)), Timestamp.valueOf(LocalDateTime.of(2024,12,31,23,59)));
```

</details>

### `findByCoursesCode`

**Requirement:** Find students enrolled in a course with a given code (implicit join with `courses` collection).

<details>
<summary>Expected solution</summary>

```java title="findByCoursesCode"
List<Student> findByCoursesCode(String code);
```

Usage:
```java title="findByCoursesCode (2)"
repo.findByCoursesCode("CS101");
```

</details>


### `findByCoursesTitleContainingIgnoreCase`

**Requirement:** Search for students who have courses whose title contains a substring (case-insensitive).

<details>
<summary>Expected solution</summary>

```java title="findByCoursesTitleContainingIgnoreCase"
List<Student> findByCoursesTitleContainingIgnoreCase(String titlePart);
```

Usage:
```java title="findByCoursesTitleContainingIgnoreCase (2)"
repo.findByCoursesTitleContainingIgnoreCase("data");
```

</details>


### `findDistinctByCoursesCode`

**Requirement:** Find distinct students (without duplicates) enrolled in course `code`.

<details>
<summary>Expected solution</summary>

```java title="findDistinctByCoursesCode"
List<Student> findDistinctByCoursesCode(String code);
```

Usage:
```java title="findDistinctByCoursesCode (2)"
repo.findDistinctByCoursesCode("CS101");
```

</details>


### `findByAdvisorLastName`

**Requirement:** Find students whose advisor (ManyToOne Instructor) has a given last name.

<details>
<summary>Expected solution</summary>

```java title="findByAdvisorLastName"
List<Student> findByAdvisorLastName(String lastName);
```

Usage:
```java title="findByAdvisorLastName (2)"
repo.findByAdvisorLastName("Gonzalez");
```

</details>


### `findByAdvisorId`

**Requirement:** Find students by their advisor ID.

<details>
<summary>Expected solution</summary>

```java title="findByAdvisorId"
List<Student> findByAdvisorId(Long instructorId);
```

Usage:
```java title="findByAdvisorId (2)"
repo.findByAdvisorId(42L);
```

</details>


### `findByAdvisorIsNull`

**Requirement:** Find students who do not have an assigned advisor.

<details>
<summary>Expected solution</summary>

```java title="findByAdvisorIsNull"
List<Student> findByAdvisorIsNull();
```

Usage:
```java title="findByAdvisorIsNull (2)"
repo.findByAdvisorIsNull();
```

</details>


### `existsByEmail`

**Requirement:** Check if a student exists with a given `email`.

<details>
<summary>Expected solution</summary>

```java title="existsByEmail"
boolean existsByEmail(String email);
```

Usage:
```java title="existsByEmail (2)"
boolean exists = repo.existsByEmail("alice@example.com");
```

</details>


### `countByActiveTrue`

**Requirement:** Count how many students are active.

<details>
<summary>Expected solution</summary>

```java title="countByActiveTrue"
long countByActiveTrue();
```

Usage:
```java title="countByActiveTrue (2)"
long activeStudents = repo.countByActiveTrue();
```

</details>


### `deleteByUsername`

**Requirement:** Delete students by `username` (reserved repository method: delete...).

<details>
<summary>Expected solution</summary>

```java title="deleteByUsername"
void deleteByUsername(String username);
```

Usage:
```java title="deleteByUsername (2)"
repo.deleteByUsername("old_user");
```

</details>


### `findTop5ByOrderByGpaDesc`

**Requirement:** Return the top 5 students with the highest GPA (Top / OrderBy).

<details>
<summary>Expected solution</summary>

```java title="findTop5ByOrderByGpaDesc"
List<Student> findTop5ByOrderByGpaDesc();
```

Usage:
```java title="findTop5ByOrderByGpaDesc (2)"
List<Student> top5 = repo.findTop5ByOrderByGpaDesc();
```

</details>


### `findFirstByOrderByRegistrationDateAsc`

**Requirement:** Find the first student (oldest) ordered by registration date.

<details>
<summary>Expected solution</summary>

```java title="findFirstByOrderByRegistrationDateAsc"
Optional<Student> findFirstByOrderByRegistrationDateAsc();
```

Usage:
```java title="findFirstByOrderByRegistrationDateAsc (2)"
Optional<Student> first = repo.findFirstByOrderByRegistrationDateAsc();
```

</details>


### `findByFirstNameStartingWith`

**Requirement:** Search for students whose `firstName` starts with a given prefix.

<details>
<summary>Expected solution</summary>

```java title="findByFirstNameStartingWith"
List<Student> findByFirstNameStartingWith(String prefix);
```

Usage:
```java title="findByFirstNameStartingWith (2)"
repo.findByFirstNameStartingWith("Al");
```

</details>


### `findByLastNameEndingWith`

**Requirement:** Search for students whose `lastName` ends with a given suffix.

<details>
<summary>Expected solution</summary>

```java title="findByLastNameEndingWith"
List<Student> findByLastNameEndingWith(String suffix);
```

Usage:
```java title="findByLastNameEndingWith (2)"
repo.findByLastNameEndingWith("ez");
```

</details>


### `findByFirstNameContaining`

**Requirement:** Search for students whose `firstName` contains a substring.

<details>
<summary>Expected solution</summary>

```java title="findByFirstNameContaining"
List<Student> findByFirstNameContaining(String fragment);
```

Usage:
```java title="findByFirstNameContaining (2)"
repo.findByFirstNameContaining("li");
```

</details>


### `findByEmailLike`

**Requirement:** Search for students by `email` using LIKE (use % for wildcards).

<details>
<summary>Expected solution</summary>

```java title="findByEmailLike"
List<Student> findByEmailLike(String pattern);
```

Usage:
```java title="findByEmailLike (2)"
repo.findByEmailLike("%example.com");
```

</details>


### `findByGpaIsNull`

**Requirement:** Find students whose `gpa` is NULL.

<details>
<summary>Expected solution</summary>

```java title="findByGpaIsNull"
List<Student> findByGpaIsNull();
```

</details>


### `findByGpaIsNotNull`

**Requirement:** Find students whose `gpa` is not NULL.

<details>
<summary>Expected solution</summary>

```java title="findByGpaIsNotNull"
List<Student> findByGpaIsNotNull();
```

</details>


### `findByUsernameIn`

**Requirement:** Find students whose `username` is in a given collection (IN).

<details>
<summary>Expected solution</summary>

```java title="findByUsernameIn"
List<Student> findByUsernameIn(Collection<String> usernames);
```

Usage:
```java title="findByUsernameIn (2)"
repo.findByUsernameIn(List.of("a","b","c"));
```

</details>


### `findByUsernameNotIn`

**Requirement:** Find students whose `username` is NOT in a given collection (NOT IN).

<details>
<summary>Expected solution</summary>

```java title="findByUsernameNotIn"
List<Student> findByUsernameNotIn(Collection<String> usernames);
```

</details>


### `findByUsernameNot`

**Requirement:** Find students whose `username` is NOT the provided one (NOT).

<details>
<summary>Expected solution</summary>

```java title="findByUsernameNot"
List<Student> findByUsernameNot(String username);
```

</details>


### `findByDepartmentName (CourseRepository)`

**Requirement:** In CourseRepository: search for courses by associated department name.

<details>
<summary>Expected solution</summary>

```java title="findByDepartmentName (CourseRepository)"
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByDepartmentName(String deptName);
}
```

Usage:
```java title="findByDepartmentName (CourseRepository) (2)"
courseRepo.findByDepartmentName("Computer Science");
```

</details>


### `findByCreditsLessThan (CourseRepository)`

**Requirement:** Find courses with fewer than N credits.

<details>
<summary>Expected solution</summary>

```java title="findByCreditsLessThan (CourseRepository)"
List<Course> findByCreditsLessThan(int credits);
```

Usage:
```java title="findByCreditsLessThan (CourseRepository) (2)"
courseRepo.findByCreditsLessThan(4);
```

</details>


### `findByLevelIn (CourseRepository)`

**Requirement:** Find courses whose `level` is within a collection of levels.

<details>
<summary>Expected solution</summary>

```java title="findByLevelIn (CourseRepository)"
List<Course> findByLevelIn(Collection<Level> levels);
```

Usage:
```java title="findByLevelIn (CourseRepository) (2)"
courseRepo.findByLevelIn(List.of(Level.BEGINNER, Level.INTERMEDIATE));
```

</details>


### `findByEnrollmentsGradeGreaterThan`

**Requirement:** Find students who have an enrollment (`enrollments`) with a grade greater than X.

<details>
<summary>Expected solution</summary>

```java title="findByEnrollmentsGradeGreaterThan"
List<Student> findByEnrollmentsGradeGreaterThan(Double grade);
```

Usage:
```java title="findByEnrollmentsGradeGreaterThan (2)"
repo.findByEnrollmentsGradeGreaterThan(85.0);
```

</details>


### `findByEnrollmentsStatus`

**Requirement:** Find students according to the status of any of their enrollments.

<details>
<summary>Expected solution</summary>

```java title="findByEnrollmentsStatus"
List<Student> findByEnrollmentsStatus(EnrollmentStatus status);
```

Usage:
```java title="findByEnrollmentsStatus (2)"
repo.findByEnrollmentsStatus(EnrollmentStatus.COMPLETED);
```

</details>


### `findByEnrollmentsSemesterAndCourseCode`

**Requirement:** Find students enrolled in a specific course during a concrete semester.

<details>
<summary>Expected solution</summary>

```java title="findByEnrollmentsSemesterAndCourseCode"
List<Student> findByEnrollmentsSemesterAndEnrollmentsCourseCode(Semester semester, String courseCode);
```

Usage:
```java title="findByEnrollmentsSemesterAndCourseCode (2)"
repo.findByEnrollmentsSemesterAndEnrollmentsCourseCode(Semester.FALL, "CS101");
```

</details>


### `findByCoursesLevelAndCreditsGreaterThan`

**Requirement:** Find students who have at least one course with a given `level` and more than N credits.

<details>
<summary>Expected solution</summary>

```java title="findByCoursesLevelAndCreditsGreaterThan"
List<Student> findByCoursesLevelAndCoursesCreditsGreaterThan(Level level, int credits);
```

Usage:
```java title="findByCoursesLevelAndCreditsGreaterThan (2)"
repo.findByCoursesLevelAndCoursesCreditsGreaterThan(Level.ADVANCED, 3);
```

</details>


### `findByActiveTrue (paginated)`

**Requirement:** Pagination: return active students using `Pageable`.

<details>
<summary>Expected solution</summary>

```java title="findByActiveTrue (paginated)"
Page<Student> findByActiveTrue(Pageable pageable);
```

Usage:
```java title="findByActiveTrue (paginated) (2)"
Page<Student> page = repo.findByActiveTrue(PageRequest.of(0, 20, Sort.by("gpa").descending()));
```

</details>


### `findByCoursesStartDateBefore`

**Requirement:** Find students who have courses whose `startDate` is before a given date.

<details>
<summary>Expected solution</summary>

```java title="findByCoursesStartDateBefore"
List<Student> findByCoursesStartDateBefore(Timestamp date);
```

Usage:
```java title="findByCoursesStartDateBefore (2)"
repo.findByCoursesStartDateBefore(Timestamp.valueOf(LocalDateTime.now()));
```

</details>


### `findByFirstNameIgnoreCaseAndLastNameIgnoreCase`

**Requirement:** Search comparing `firstName` and `lastName` ignoring case.

<details>
<summary>Expected solution</summary>

```java title="findByFirstNameIgnoreCaseAndLastNameIgno"
List<Student> findByFirstNameIgnoreCaseAndLastNameIgnoreCase(String first, String last);
```

</details>


### `findDistinctByFirstNameAndLastName`

**Requirement:** Return distinct results when filtering by first and last name.

<details>
<summary>Expected solution</summary>

```java title="findDistinctByFirstNameAndLastName"
List<Student> findDistinctByFirstNameAndLastName(String first, String last);
```

</details>


### `findByEmailEndingWith`

**Requirement:** Search for students whose email ends with a given string.

<details>
<summary>Expected solution</summary>

```java title="findByEmailEndingWith"
List<Student> findByEmailEndingWith(String suffix);
// Ej: findByEmailEndingWith("@gmail.com")
```

</details>


### `findByFirstNameOrderByLastNameAsc`

**Requirement:** Sort: return students with a given `firstName` ordered by `lastName` ascending.

<details>
<summary>Expected solution</summary>

```java title="findByFirstNameOrderByLastNameAsc"
List<Student> findByFirstNameOrderByLastNameAsc(String firstName);
```

</details>


### `findByLastNameOrderByFirstNameDesc`

**Requirement:** Sort by `firstName` descending.

<details>
<summary>Expected solution</summary>

```java title="findByLastNameOrderByFirstNameDesc"
List<Student> findByLastNameOrderByFirstNameDesc(String lastName);
```

</details>


### `findByCoursesCodeOrderByCreditsDesc`

**Requirement:** Search students by course code and sort by credits (descending).

<details>
<summary>Expected solution</summary>

```java title="findByCoursesCodeOrderByCreditsDesc"
List<Student> findByCoursesCodeOrderByCoursesCreditsDesc(String courseCode);
```

Usage:
```java title="findByCoursesCodeOrderByCreditsDesc (2)"
repo.findByCoursesCodeOrderByCoursesCreditsDesc("CS101");
```

</details>


### `streamByActiveTrue`

**Requirement:** Return a `Stream` of active students (useful for processing large result sets).

<details>
<summary>Expected solution</summary>

```java title="streamByActiveTrue"
Stream<Student> streamByActiveTrue();
```

Uso (recordar cerrar el stream si es necesario):
```java title="streamByActiveTrue (2)"
try (Stream<Student> s = repo.streamByActiveTrue()) {
    s.forEach(...);
}
```

</details>


### `findTopByOrderByGpaAsc`

**Requirement:** Return the student with lowest GPA.

<details>
<summary>Expected solution</summary>

```java title="findTopByOrderByGpaAsc"
Optional<Student> findTopByOrderByGpaAsc();
```

Usage:
```java title="findTopByOrderByGpaAsc (2)"
Optional<Student> worst = repo.findTopByOrderByGpaAsc();
```

</details>


### `findByRegistrationDateYear (ejemplo con Between)`

**Requirement:** Search students registered in a given year using date range Between.

<details>
<summary>Expected solution</summary>

```java title="findByRegistrationDateYear"
List<Student> findByRegistrationDateBetween(Timestamp startOfYear, Timestamp endOfYear);
// Ejemplo de llamada:
// repo.findByRegistrationDateBetween(Timestamp.valueOf(LocalDateTime.of(2024,1,1,0,0)), Timestamp.valueOf(LocalDateTime.of(2024,12,31,23,59)));
```

</details>


### `findByFirstNameNot`

**Requirement:** Find students whose `firstName` is not the given one.

<details>
<summary>Expected solution</summary>

```java title="findByFirstNameNot"
List<Student> findByFirstNameNot(String name);
```

</details>


### `findByEmailContainingIgnoreCaseAndActiveTrue`

**Requirement:** Complex combination: email contains X (ignoring case) and active = true.

<details>
<summary>Expected solution</summary>

```java title="findByEmailContainingIgnoreCaseAndActive"
List<Student> findByEmailContainingIgnoreCaseAndActiveTrue(String fragment);
```

Usage:
```java title="findByEmailContainingIgnoreCaseAndActive (2)"
repo.findByEmailContainingIgnoreCaseAndActiveTrue("example");
```

</details>


### `findDistinctByCoursesDepartmentName`

**Requirement:** Return distinct students enrolled in courses of a department with a given name.

<details>
<summary>Expected solution</summary>

```java title="findDistinctByCoursesDepartmentName"
List<Student> findDistinctByCoursesDepartmentName(String deptName);
```

Usage:
```java title="findDistinctByCoursesDepartmentName (2)"
repo.findDistinctByCoursesDepartmentName("Mathematics");
```

</details>


### `findByEnrollmentsCourseCodeAndEnrollmentsStatus`

**Requirement:** Find students by course code and enrollment status.

<details>
<summary>Expected solution</summary>

```java title="findByEnrollmentsCourseCodeAndEnrollment"
List<Student> findByEnrollmentsCourseCodeAndEnrollmentsStatus(String courseCode, EnrollmentStatus status);
```

Usage:
```java title="findByEnrollmentsCourseCodeAndEnrollment (2)"
repo.findByEnrollmentsCourseCodeAndEnrollmentsStatus("CS101", EnrollmentStatus.ENROLLED);
```

</details>


### `existsByUsername`

**Requirement:** Check existence by `username`.

<details>
<summary>Expected solution</summary>

```java title="existsByUsername"
boolean existsByUsername(String username);
```

Usage:
```java title="existsByUsername (2)"
boolean e = repo.existsByUsername("kevin");
```

</details>


### `deleteAllByActiveFalse`

**Requirement:** Delete all inactive students (reserved repository method: deleteAllBy...).

<details>
<summary>Expected solution</summary>

```java title="deleteAllByActiveFalse"
void deleteAllByActiveFalse();
```

Usage:
```java title="deleteAllByActiveFalse (2)"
repo.deleteAllByActiveFalse();
```

</details>


### `findByFirstNameOrLastName`

**Requirement:** Search students whose `firstName` OR `lastName` matches parameters.

<details>
<summary>Expected solution</summary>

```java title="findByFirstNameOrLastName"
List<Student> findByFirstNameOrLastName(String first, String last);
```

Usage:
```java title="findByFirstNameOrLastName (2)"
repo.findByFirstNameOrLastName("Carlos","Gomez");
```

</details>


### `findByFirstNameNotContaining`

**Requirement:** Find students whose `firstName` does NOT contain a substring.

<details>
<summary>Expected solution</summary>

```java title="findByFirstNameNotContaining"
List<Student> findByFirstNameNotContaining(String fragment);
```

Usage:
```java title="findByFirstNameNotContaining (2)"
repo.findByFirstNameNotContaining("test");
```

</details>



## Final Notes

- Many keywords supported by Spring Data JPA (such as `And`, `Or`, `Between`, `LessThan`, `GreaterThan`, `Like`, `OrderBy`, `Distinct`, `Top`, `First`, `IgnoreCase`, `IsNull`, `IsNotNull`, etc.) allow expressing powerful conditions without writing explicit JPQL.
- When derived expressions become overly complex (multiple joins, subqueries, dynamic criteria), consider using `@Query` with JPQL/SQL, QueryDSL, or Specification/Criteria API.  
- For pagination and sorting options, prefer using `Pageable` and `Sort` in method parameters instead of writing verbose `OrderBy` method names.
