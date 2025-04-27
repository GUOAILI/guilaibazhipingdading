package com.guoaili.zackback.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CommonUpdVo extends CommonVo {
    private Long id;
    private String delImages;
}