export interface IAccount {
  user_idx: number; //	사용자 고유식별 번호
  selected_store_idx: number; //	선택한 매장 고유식별 번호
  selected_store_name: string; //	선택한 매장명
  user_info: {
    user_idx: number; // 사용자 고유식별 번호
    user_name: string; // 사용자 이름
    user_email: string; // 사용자 이메일
    is_active: number; // 재직 여부 (0=재직, 1=휴직, 9=퇴직)
    is_staff: number; // 소속 (0=본사, 1=매장, 2=외부 업체)
    security_level: number; // 시스템 권한 (0=일반, 3=SV, 7=운영자, 9=관리자)
    is_permit: number; // 승인 여부 (0=대기, 1=승인)
  };
  store: {
    store_idx: number; // 매장 고유식별 번호
    store_name: string; // 매장명
  }[];
  permission: {
    perm_group_info_idx: number;
    perm_group_name: string;
    perm_list: {
      perm_info_idx: number;
      perm_info_name: string;
      perm_code: string;
    }[];
  };
}
