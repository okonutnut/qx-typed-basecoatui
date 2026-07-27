const GRAPHQL_URL = "http://localhost:5071/graphql";

async function graphqlRequest(query: string, variables?: any): Promise<any> {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }
  return json.data;
}

const ACCESS_LEVEL_FIELDS = "id code name createdAt updatedAt";
const COURSE_FIELDS = "id code name createdAt updatedAt";
const USER_FIELDS = "id code name email dateOfBirth createdAt updatedAt";
const PROFILE_FIELDS = "id code name firstName middleName lastName extentionName email phone sex dateOfBirth birthPlace municipality barangay street citizenship addressEmail addressPhone createdAt updatedAt";
const FAMILY_ENTRY_FIELDS = "lastName firstName middleName phone occupation anualIncome";
const FAMILY_BG_FIELDS = `id code name father { ${FAMILY_ENTRY_FIELDS} } mother { ${FAMILY_ENTRY_FIELDS} } guardian { ${FAMILY_ENTRY_FIELDS} } createdAt updatedAt`;
const ADMISSION_DATA_FIELDS = "id code name lrn level type yearLevel status score result createdAt updatedAt";
const APPLICATION_FIELDS = "id createdAt updatedAt";

const QUERIES = {
  accessLevels: `query { accessLevels { ${ACCESS_LEVEL_FIELDS} } }`,
  courses: `query { courses { ${COURSE_FIELDS} } }`,
  users: `query { users { ${USER_FIELDS} } }`,
  personalProfiles: `query { personalProfiles { ${PROFILE_FIELDS} } }`,
  familyBackgrounds: `query { familyBackgrounds { ${FAMILY_BG_FIELDS} } }`,
  admissionDataList: `query { admissionDataList { ${ADMISSION_DATA_FIELDS} } }`,
  admissionApplications: `query { admissionApplications { ${APPLICATION_FIELDS} } }`,
};

const MUTATIONS = {
  createAccessLevel: `mutation($input: CreateAccessLevelInput!) { createAccessLevel(input: $input) { ${ACCESS_LEVEL_FIELDS} } }`,
  createCourse: `mutation($input: CreateCourseInput!) { createCourse(input: $input) { ${COURSE_FIELDS} } }`,
  createUser: `mutation($input: CreateUserInput!) { createUser(input: $input) { ${USER_FIELDS} } }`,
  createPersonalProfile: `mutation($input: CreatePersonalProfileInput!) { createPersonalProfile(input: $input) { ${PROFILE_FIELDS} } }`,
  createFamilyBackground: `mutation($input: CreateFamilyBackgroundInput!) { createFamilyBackground(input: $input) { ${FAMILY_BG_FIELDS} } }`,
  createAdmissionData: `mutation($input: CreateAdmissionDataInput!) { createAdmissionData(input: $input) { ${ADMISSION_DATA_FIELDS} } }`,
  createAdmissionApplication: `mutation($input: CreateAdmissionApplicationInput!) { createAdmissionApplication(input: $input) { ${APPLICATION_FIELDS} } }`,
  attachPersonalProfile: `mutation($input: AttachToApplicationInput!) { attachPersonalProfile(input: $input) { ${APPLICATION_FIELDS} } }`,
  attachFamilyBackground: `mutation($input: AttachToApplicationInput!) { attachFamilyBackground(input: $input) { ${APPLICATION_FIELDS} } }`,
  attachAdmissionData: `mutation($input: AttachToApplicationInput!) { attachAdmissionData(input: $input) { ${APPLICATION_FIELDS} } }`,
  updateAdmissionStatus: `mutation($input: UpdateAdmissionStatusInput!) { updateAdmissionStatus(input: $input) { ${ADMISSION_DATA_FIELDS} } }`,
  updateAccessLevel: `mutation($input: UpdateAccessLevelInput!) { updateAccessLevel(input: $input) { ${ACCESS_LEVEL_FIELDS} } }`,
  updateCourse: `mutation($input: UpdateCourseInput!) { updateCourse(input: $input) { ${COURSE_FIELDS} } }`,
  updateUser: `mutation($input: UpdateUserInput!) { updateUser(input: $input) { ${USER_FIELDS} } }`,
  updatePersonalProfile: `mutation($input: UpdatePersonalProfileInput!) { updatePersonalProfile(input: $input) { ${PROFILE_FIELDS} } }`,
  updateFamilyBackground: `mutation($input: UpdateFamilyBackgroundInput!) { updateFamilyBackground(input: $input) { ${FAMILY_BG_FIELDS} } }`,
  updateAdmissionData: `mutation($input: UpdateAdmissionDataInput!) { updateAdmissionData(input: $input) { ${ADMISSION_DATA_FIELDS} } }`,
  updateAdmissionApplication: `mutation($input: UpdateAdmissionApplicationInput!) { updateAdmissionApplication(input: $input) { ${APPLICATION_FIELDS} } }`,
};

const LOGIN_QUERY = `query { users { id code name password email dateOfBirth createdAt updatedAt accessLevel { id code name } } }`;

async function loginUser(code: string, password: string): Promise<any> {
  const data = await graphqlRequest(LOGIN_QUERY);
  const users = data.users || [];
  const match = users.find((u: any) => u.code.toLowerCase() === code.toLowerCase() && u.password === password);
  if (!match) return null;
  return {
    name: match.name,
    role: match.accessLevel?.code ?? "",
    accessCode: match.accessLevel?.name ?? "",
    raw: match,
  };
}

async function queryList(entityType: string): Promise<any[]> {
  const queryMap: Record<string, string> = {
    AccessLevel: "accessLevels",
    Course: "courses",
    User: "users",
    PersonalProfile: "personalProfiles",
    FamilyBackground: "familyBackgrounds",
    AdmissionData: "admissionDataList",
    AdmissionApplication: "admissionApplications",
  };
  const key = queryMap[entityType];
  if (!key) throw new Error(`Unknown entity: ${entityType}`);
  const data = await graphqlRequest(QUERIES[key as keyof typeof QUERIES]);
  return data[key] ?? [];
}

async function createEntity(entityType: string, input: any): Promise<any> {
  const mutationMap: Record<string, { key: string; mutation: string }> = {
    AccessLevel: { key: "createAccessLevel", mutation: MUTATIONS.createAccessLevel },
    Course: { key: "createCourse", mutation: MUTATIONS.createCourse },
    User: { key: "createUser", mutation: MUTATIONS.createUser },
    PersonalProfile: { key: "createPersonalProfile", mutation: MUTATIONS.createPersonalProfile },
    FamilyBackground: { key: "createFamilyBackground", mutation: MUTATIONS.createFamilyBackground },
    AdmissionData: { key: "createAdmissionData", mutation: MUTATIONS.createAdmissionData },
    AdmissionApplication: { key: "createAdmissionApplication", mutation: MUTATIONS.createAdmissionApplication },
  };
  const entry = mutationMap[entityType];
  if (!entry) throw new Error(`Unknown entity: ${entityType}`);
  const data = await graphqlRequest(entry.mutation, { input });
  return data[entry.key];
}

async function updateEntity(entityType: string, id: string, input: any): Promise<any> {
  const mutationMap: Record<string, { key: string; mutation: string }> = {
    AccessLevel: { key: "updateAccessLevel", mutation: MUTATIONS.updateAccessLevel },
    Course: { key: "updateCourse", mutation: MUTATIONS.updateCourse },
    User: { key: "updateUser", mutation: MUTATIONS.updateUser },
    PersonalProfile: { key: "updatePersonalProfile", mutation: MUTATIONS.updatePersonalProfile },
    FamilyBackground: { key: "updateFamilyBackground", mutation: MUTATIONS.updateFamilyBackground },
    AdmissionData: { key: "updateAdmissionData", mutation: MUTATIONS.updateAdmissionData },
    AdmissionApplication: { key: "updateAdmissionApplication", mutation: MUTATIONS.updateAdmissionApplication },
  };
  const entry = mutationMap[entityType];
  if (!entry) throw new Error(`Unknown entity: ${entityType}`);
  const cleaned: Record<string, any> = {};
  for (const key in input) {
    const v = input[key];
    if (v !== "" && v !== null && v !== undefined) {
      cleaned[key] = v;
    }
  }
  const data = await graphqlRequest(entry.mutation, { input: { ...cleaned, id } });
  return data[entry.key];
}
