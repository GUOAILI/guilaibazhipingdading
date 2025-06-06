package com.guoaili.zackback.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SummaryUpdVo extends SummaryVo {
    private Long id;
    private String delImages;
}