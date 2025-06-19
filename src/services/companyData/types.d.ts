export type SearchResponse = {
  results?: Record<string, CompanyData[]>;
};

type CompanyData = {
  company_name: string;
  company_number: string;
  reg_address_care_of?: string;
  reg_address_po_box?: string;
  reg_address_address_line_1: string;
  reg_address_address_line_2?: string;
  reg_address_post_town: string;
  reg_address_county?: string;
  reg_address_country: string;
  reg_address_post_code: string;
  company_category: string;
  company_status: string;
  country_of_origin: string;
  incorporation_date: string;
  accounts_account_ref_day: number;
  accounts_account_ref_month: number;
  accounts_next_due_date: Date;
  accounts_last_made_up_date: Date;
  accounts_account_category: string;
  returns_next_due_date: Date;
  returns_last_made_up_date: Date;
  mortgages_num_charges: number;
  mortgages_num_outstanding: number;
  mortgages_num_part_satisfied: number;
  mortgages_num_satisfied: number;
  sic_code_1: string;
  sic_code_2: string;
  sic_code_3: string;
  sic_code_4: string;
  limited_partnerships_num_gen_partners: number;
  limited_partnerships_num_lim_partners: number;
  uri: string;
  conf_stmt_next_due_date: Date;
  conf_stmt_last_made_up_date: Date;

  easting: number;
  northing: number;
};
